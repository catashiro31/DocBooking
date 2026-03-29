package docbooking.admin;

import docbooking.admin.requests.Facility;
import docbooking.admin.requests.Specialty;
import docbooking.admin.responses.AppointmentAdminResponse;
import docbooking.admin.responses.AppointmentStats;
import docbooking.admin.responses.Stat;
import docbooking.models.*;
import docbooking.repositories.*;
import docbooking.utils.ContextEmail;
import docbooking.utils.ConvertUrl;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final DoctorDetailRepository doctorDetail;
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final SpecialtyRepository specialtyRepository;
    private final FacilityRepository facilityRepository;
    private final ConvertUrl convertUrl;
    private final ContextEmail contextEmail;
    private final ReviewRepository reviewRepository;
    private final DoctorScheduleRepository doctorScheduleRepository;

    public Stat getStats(LocalDate start, LocalDate end) {
        // 1. Lấy dữ liệu gộp từ Repo (Chỉ 1 lần truy vấn DB)
        AppointmentStats appStats = appointmentRepository.getAppointmentStatsByPeriod(start, end);

        if (appStats == null) {
            appStats = new AppointmentStats(0, 0, 0);
        }

        LocalDateTime startDT = start.atStartOfDay();
        LocalDateTime endDT = end.plusDays(1).atStartOfDay();

        // Thống kê ngày hôm nay
        LocalDate today = LocalDate.now();
        AppointmentStats todayStats = appointmentRepository.getAppointmentStatsByPeriod(today, today);

        // 3. Đóng gói vào kết quả trả về
        return Stat.builder()
                .numberOfDoctors(userRepository.countByRoleAndCreatedAtBetween(User.RoleStatus.DOCTOR, startDT, endDT))
                .numberOfPatients(userRepository.countByRoleAndCreatedAtBetween(User.RoleStatus.PATIENT, startDT, endDT))
                .numberOfSuccessAppointments(appStats.getCompleted())
                .numberOfPendingAppointments(appStats.getPending())
                .numberOfFailingAppointments(appStats.getCancelled())
                
                // Bổ sung các thông số tuyệt đối
                .totalUsers(userRepository.count())
                .totalDoctors(userRepository.countByRole(User.RoleStatus.DOCTOR))
                .totalPatients(userRepository.countByRole(User.RoleStatus.PATIENT))
                .totalAppointments(appointmentRepository.count())
                .totalReviews(reviewRepository.count())
                .pendingDoctors(doctorDetail.countByVerificationStatus(DoctorDetail.VerificationStatus.PENDING))
                .todayAppointments(todayStats != null ? (todayStats.getCompleted() + todayStats.getPending() + todayStats.getCancelled()) : 0)
                .build();
    }

    public Page<DoctorDetail> getAllDoctors(Pageable pageable) {
        return doctorDetail.findAll(pageable);
    }

    public List<DoctorDetail> getPendingDoctors() {
        return doctorDetail.findDoctorDetailByVerificationStatus(DoctorDetail.VerificationStatus.PENDING);
    }

    public DoctorDetail getDoctorDetail(Integer id) {
        DoctorDetail doctor = doctorDetail.findByDoctorId(id);
        if (doctor == null) {
            throw new RuntimeException("Không tìm thấy thông tin bác sĩ với ID: " + id);
        }
        return doctor;
    }

    public DoctorDetail approveDoctor(Integer doctorId) {
        DoctorDetail doctor = doctorDetail.findByDoctorId(doctorId);
        if (doctor == null) {
            throw new RuntimeException("Không tìm thấy thông tin bác sĩ với ID: " + doctorId);
        }
        if (doctor.getVerificationStatus() != DoctorDetail.VerificationStatus.PENDING) {
            throw new RuntimeException("Chỉ có thể duyệt bác sĩ đang ở trạng thái chờ duyệt!");
        }
        doctor.setVerificationStatus(DoctorDetail.VerificationStatus.APPROVED);
        String email = doctor.getUser().getEmail();
        String fullName = doctor.getUser().getFullName();
        contextEmail.sendDoctorApprovedEmail(email, fullName);
        return doctorDetail.save(doctor);
    }

    public DoctorDetail rejectDoctor(Integer doctorId, String reason) {
        DoctorDetail doctor = doctorDetail.findByDoctorId(doctorId);
        if (doctor == null) {
            throw new RuntimeException("Không tìm thấy thông tin bác sĩ với ID: " + doctorId);
        }
        if (doctor.getVerificationStatus() != DoctorDetail.VerificationStatus.PENDING) {
            throw new RuntimeException("Chỉ có thể từ chối bác sĩ đang ở trạng thái chờ duyệt!");
        }
        doctor.setVerificationStatus(DoctorDetail.VerificationStatus.REJECTED);
        doctor.setReasonReject(reason);
        String email = doctor.getUser().getEmail();
        String fullName = doctor.getUser().getFullName();
        contextEmail.sendDoctorRejectedEmail(email, fullName, reason);
        doctorDetail.save(doctor);
        return doctor;
    }

    // Phân trang: nhận Pageable, trả về Page<User>
    public Page<User> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    @Transactional
    public String setBlockedUser(Integer userId, String reason) {
        User user = userRepository.findByUserId(userId);
        if (user == null) {
            throw new RuntimeException("Không tìm thấy người dùng với ID: " + userId);
        }
        user.setIsActive(false);
        user.setReasonBanned(reason);
        User savedUser = userRepository.save(user);

        // Hủy tất cả lịch hẹn đang active của user này (với tư cách bệnh nhân)
        List<Appointment.BookingStatus> activeStatuses = List.of(
                Appointment.BookingStatus.PENDING,
                Appointment.BookingStatus.CONFIRMED
        );
        List<Appointment> activeAppointments = appointmentRepository.findByPatient_User_UserIdAndBookingStatusIn(
                userId, activeStatuses);
        for (Appointment app : activeAppointments) {
            app.setBookingStatus(Appointment.BookingStatus.CANCELLED);
            appointmentRepository.save(app);
            // Mở lại slot nếu ngày khám chưa qua
            DoctorSchedule schedule = app.getSchedule();
            if (schedule != null && !schedule.getDateWorking().isBefore(LocalDate.now())) {
                schedule.setSlotStatus(DoctorSchedule.SlotStatus.AVAILABLE);
                doctorScheduleRepository.save(schedule);
            }
        }

        // Nếu user là bác sĩ, hủy tất cả lịch hẹn của bệnh nhân với bác sĩ này và đóng các slot
        if (savedUser.getRole() == User.RoleStatus.DOCTOR) {
            // Hủy tất cả appointment đang active của bác sĩ
            List<Appointment> doctorAppointments = appointmentRepository.findBySchedule_Doctor_User_UserIdAndBookingStatusIn(
                    userId, activeStatuses);
            for (Appointment app : doctorAppointments) {
                app.setBookingStatus(Appointment.BookingStatus.CANCELLED);
                appointmentRepository.save(app);
            }
            // Đóng tất cả slot AVAILABLE của bác sĩ
            doctorScheduleRepository.closeAllAvailableSlotsByDoctorUserId(userId);
        }

        contextEmail.sendPermanentBanEmail(
                savedUser.getEmail(),
                savedUser.getFullName(),
                reason
        );
        return "Đã khóa tài khoản id " + userId;
    }

    public String addSpecialty(Specialty req) {
        String name = req.getSpecialtyName().trim();

        // Kiểm tra trùng tên
        if (specialtyRepository.existsBySpecialtyNameIgnoreCase(name)) {
            throw new RuntimeException("Chuyên khoa '" + name + "' đã tồn tại trong hệ thống!");
        }

        docbooking.models.Specialty specialty = docbooking.models.Specialty.builder()
                .specialtyName(name)
                .description(req.getDescription())
                .isActive(true)
                .build();
        specialtyRepository.save(specialty);
        return "Đã thêm chuyên khoa";
    }

    public String updateSpecialty(Integer specialtyId, Specialty req) {
        docbooking.models.Specialty specialty = specialtyRepository.findById(specialtyId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chuyên khoa!"));

        String newName = req.getSpecialtyName().trim();

        // KIỂM TRA TRÙNG:
        if (specialtyRepository.existsBySpecialtyNameIgnoreCaseAndSpecialtyIdNot(newName, specialtyId)) {
            throw new RuntimeException("Tên chuyên khoa '" + newName + "' đã được sử dụng bởi một chuyên khoa khác!");
        }

        specialty.setSpecialtyName(newName);
        specialty.setDescription(req.getDescription());
        specialtyRepository.save(specialty);
        return "Đã sửa thành công chuyên khoa";
    }

    public String deleteSpecialty(Integer specialtyId) {
        docbooking.models.Specialty specialty = specialtyRepository.findById(specialtyId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chuyên khoa với ID: " + specialtyId));
        specialty.setIsActive(false);
        specialtyRepository.save(specialty);
        return "Đã xóa chuyên ngành!";
    }

    @Transactional
    public String addFacility(Facility req) {
        // 1. Chuẩn hóa tên
        String name = req.getFacilityName().trim();

        // 2. Kiểm tra trùng tên toàn hệ thống
        if (facilityRepository.existsByFacilityNameIgnoreCase(name)) {
            throw new RuntimeException("Cơ sở y tế '" + name + "' đã tồn tại!");
        }

        docbooking.models.Facility facility = docbooking.models.Facility.builder()
                .address(req.getAddress())
                .description(req.getDescription())
                .facilityName(name)
                .imageUrl(convertUrl.getUrlFile(req.getFile()))
                .isActive(true)
                .build();
        facilityRepository.save(facility);
        return "Đã thêm thành công cơ sở y tế";
    }

    @Transactional
    public String updateFacility(Integer facilityId, Facility req) {
        // 1. Kiểm tra tồn tại
        docbooking.models.Facility facility = facilityRepository.findByFacilityId(facilityId);
        if (facility == null) {
            throw new RuntimeException("Không tìm thấy cơ sở y tế!");
        }

        // 2. Chuẩn hóa tên mới
        String newName = req.getFacilityName().trim();

        // 3. Kiểm tra xem tên mới có trùng với cơ sở nào KHÁC không
        if (facilityRepository.existsByFacilityNameIgnoreCaseAndFacilityIdNot(newName, facilityId)) {
            throw new RuntimeException("Tên '" + newName + "' đã được sử dụng bởi một cơ sở khác!");
        }

        // 4. Cập nhật thông tin
        facility.setAddress(req.getAddress());
        facility.setFacilityName(newName);
        facility.setDescription(req.getDescription());

        // Chỉ cập nhật ảnh nếu người dùng có gửi file mới
        if (req.getFile() != null && !req.getFile().isEmpty()) {
            facility.setImageUrl(convertUrl.getUrlFile(req.getFile()));
        }
        facilityRepository.save(facility);
        return "Đã cập nhật thông tin cơ sở y tế";
    }

    public String deleteFacility(Integer facilityId) {
        docbooking.models.Facility facility = facilityRepository.findById(facilityId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cơ sở y tế với ID: " + facilityId));
        facility.setIsActive(false);
        facilityRepository.save(facility);
        return "Đã xóa thành công cơ sở!";
    }

    public Page<AppointmentAdminResponse> getAllAppointments(LocalDateTime dateFrom, LocalDateTime dateTo, Appointment.BookingStatus status, Pageable pageable) {
        if (dateFrom.isAfter(dateTo)) {
            throw new RuntimeException("Ngày bắt đầu không được lớn hơn ngày kết thúc!");
        }
        Page<Appointment> appointments = appointmentRepository.findAllByPeriodAndStatus(dateFrom, dateTo, status, pageable);
        
        return appointments.map(this::mapToAdminResponse);
    }

    private AppointmentAdminResponse mapToAdminResponse(Appointment a) {
        DoctorSchedule s = a.getSchedule();
        DoctorDetail d = s != null ? s.getDoctor() : null;
        User doctorUser = d != null ? d.getUser() : null;
        PatientProfile p = a.getPatient();
        User patientUser = p != null ? p.getUser() : null;

        return AppointmentAdminResponse.builder()
                .appointmentId(a.getId())
                .patientId(p != null ? p.getPatientId() : null)
                .patientName(patientUser != null ? patientUser.getFullName() : p != null ? p.getFullName() : "N/A")
                .patientPhone(patientUser != null ? patientUser.getPhoneNumber() : "N/A")
                .patientEmail(patientUser != null ? patientUser.getEmail() : "N/A")
                .doctorId(d != null ? d.getDoctorId() : null)
                .doctorName(doctorUser != null ? doctorUser.getFullName() : "N/A")
                .specialtyName(d != null && d.getSpecialty() != null ? d.getSpecialty().getSpecialtyName() : "N/A")
                .facilityName(d != null && d.getFacility() != null ? d.getFacility().getFacilityName() : "N/A")
                .dateWorking(s != null ? s.getDateWorking() : null)
                .timeSlot(s != null && s.getTimeSlot() != null ? s.getTimeSlot().name().replace("SLOT_", "").replace("_", ":") : "N/A")
                .reason(a.getReason())
                .bookingStatus(a.getBookingStatus())
                .createdAt(a.getCreatedAt())
                .build();
    }

    public Page<Review> getAllReviews(Pageable pageable) {
        return reviewRepository.findAll(pageable);
    }

    @Transactional
    public String rejectReview(Integer id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài đánh giá với ID: " + id));
        review.setIsVisible(false);
        reviewRepository.save(review);

        // Cập nhật lại rating bác sĩ sau khi ẩn review
        Integer doctorId = review.getAppointment().getSchedule().getDoctor().getDoctorId();
        updateDoctorStats(doctorId);

        return "Đã ẩn bài đánh giá thành công";
    }

    private void updateDoctorStats(Integer doctorId) {
        DoctorDetail doctor = doctorDetail.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin bác sĩ."));

        List<Review> reviews = reviewRepository.findByAppointment_Schedule_Doctor_DoctorId(doctorId)
                .stream()
                .filter(r -> r.getIsVisible())
                .toList();
        doctor.setReviewCount(reviews.size());

        double average = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
        doctor.setRatingAverage(Math.round(average * 10.0) / 10.0);

        doctorDetail.save(doctor);
    }

}
