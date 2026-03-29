package docbooking.doctor;

import docbooking.doctor.requests.Schedule;
import docbooking.doctor.requests.ChangeProfile;
import docbooking.doctor.requests.Profile;
import docbooking.doctor.requests.MedicalResult;
import docbooking.doctor.responses.Appointment;
import docbooking.doctor.responses.Review;
import docbooking.models.*;
import docbooking.repositories.*;
import docbooking.utils.ConvertUrl;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
@RequiredArgsConstructor
public class DoctorService {
    private final DoctorDetailRepository doctorDetailRepository;
    private final SpecialtyRepository specialtyRepository;
    private final FacilityRepository facilityRepository;
    private final DoctorScheduleRepository doctorScheduleRepository;
    private final ConvertUrl convertUrl;
    private final ReviewRepository reviewRepository;
    private final AppointmentRepository appointmentRepository;
    private final MedicalResultRepository medicalResultRepository;
    private final UserRepository userRepository;

    @Transactional
    public String completeProfile(User user, Profile req) {
        Optional<DoctorDetail> existingProfile = doctorDetailRepository.findByUser(user);

        if (existingProfile.isPresent()) {
            DoctorDetail existing = existingProfile.get();
            if (existing.getVerificationStatus() == DoctorDetail.VerificationStatus.PENDING) {
                throw new RuntimeException("Hồ sơ của bạn đang trong quá trình xét duyệt. Vui lòng chờ phản hồi từ Admin!");
            }
            if (existing.getVerificationStatus() == DoctorDetail.VerificationStatus.APPROVED) {
                throw new RuntimeException("Hồ sơ bác sĩ của bạn đã được duyệt và đang hoạt động. Bạn không cần nộp lại hồ sơ xác minh!");
            }
            // Nếu REJECTED, cho phép cập nhật và gửi lại
            Specialty specialty = specialtyRepository.findById(req.getSpecialtyId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy chuyên khoa"));
            if (!Boolean.TRUE.equals(specialty.getIsActive())) {
                throw new RuntimeException("Chuyên khoa này đã ngừng hoạt động!");
            }
            Facility facility = facilityRepository.findById(req.getFacilityId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy cơ sở y tế"));
            if (!Boolean.TRUE.equals(facility.getIsActive())) {
                throw new RuntimeException("Cơ sở y tế này đã ngừng hoạt động!");
            }

            existing.setSpecialty(specialty);
            existing.setFacility(facility);
            existing.setBio(req.getBio());
            existing.setDegree(req.getDegree());
            existing.setExperienceYears(req.getExperienceYears());
            existing.setPrice(req.getPrice());
            existing.setIdCardUrl(convertUrl.getUrlFile(req.getIdCardImage()));
            existing.setCertificateUrl(convertUrl.getUrlFile(req.getCertificatePdf()));
            existing.setVerificationStatus(DoctorDetail.VerificationStatus.PENDING);
            existing.setReasonReject(null);

            doctorDetailRepository.save(existing);
            return "Hồ sơ của bạn đã được cập nhật và gửi lại thành công!";
        }

        Specialty specialty = specialtyRepository.findById(req.getSpecialtyId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chuyên khoa"));
        if (!Boolean.TRUE.equals(specialty.getIsActive())) {
            throw new RuntimeException("Chuyên khoa này đã ngừng hoạt động!");
        }
        Facility facility = facilityRepository.findById(req.getFacilityId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cơ sở y tế"));
        if (!Boolean.TRUE.equals(facility.getIsActive())) {
            throw new RuntimeException("Cơ sở y tế này đã ngừng hoạt động!");
        }

        DoctorDetail doctorDetail = DoctorDetail.builder()
                .user(user)
                .specialty(specialty)
                .facility(facility)
                .bio(req.getBio())
                .degree(req.getDegree())
                .experienceYears(req.getExperienceYears())
                .price(req.getPrice())
                .idCardUrl(convertUrl.getUrlFile(req.getIdCardImage()))
                .certificateUrl(convertUrl.getUrlFile(req.getCertificatePdf()))
                .verificationStatus(DoctorDetail.VerificationStatus.PENDING)
                .ratingAverage(0.0)
                .reviewCount(0)
                .build();

        doctorDetailRepository.save(doctorDetail);
        return "Hồ sơ của bạn đã được gửi đi thành công!";
    }

    @Transactional
    public void createDoctorSchedule(Integer userId, Schedule schedule) {
        LocalDate today = LocalDate.now();

        if (!schedule.getDate().isAfter(today)) {
            throw new RuntimeException("Vui lòng chỉ tạo lịch khám từ ngày mai trở đi!");
        }
        DoctorDetail doctor = doctorDetailRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin bác sĩ."));

        if (doctor.getVerificationStatus() != DoctorDetail.VerificationStatus.APPROVED) {
            throw new RuntimeException("Hồ sơ bác sĩ chưa được duyệt, không thể tạo lịch làm việc!");
        }

        for(String slotName: schedule.getSlotIds()){
            DoctorSchedule.TimeSlot timeSlot = DoctorSchedule.TimeSlot.valueOf(slotName);

            Optional<DoctorSchedule> existingSlotOpt = doctorScheduleRepository
                    .findByDoctor_DoctorIdAndDateWorkingAndTimeSlot(
                            doctor.getDoctorId(),
                            schedule.getDate(),
                            timeSlot
                    );
            if (existingSlotOpt.isPresent()) {
                DoctorSchedule existingSlot = existingSlotOpt.get();
                if (existingSlot.getSlotStatus() == DoctorSchedule.SlotStatus.CLOSED) {
                    existingSlot.setSlotStatus(DoctorSchedule.SlotStatus.AVAILABLE);
                    doctorScheduleRepository.save(existingSlot);
                }
                continue;
            }
            DoctorSchedule doctorSchedule = new DoctorSchedule();
            doctorSchedule.setDoctor(doctor);
            doctorSchedule.setDateWorking(schedule.getDate());
            doctorSchedule.setTimeSlot(timeSlot);

            doctorSchedule.setSlotStatus(DoctorSchedule.SlotStatus.AVAILABLE);
            doctorScheduleRepository.save(doctorSchedule);
        }
    }
    public List<docbooking.doctor.responses.Schedule> getDoctorSchedules(Integer userId) {
        DoctorDetail doctor = doctorDetailRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin bác sĩ"));
        List<DoctorSchedule> schedules = doctorScheduleRepository.findByDoctor_DoctorIdOrderByDateWorkingDesc(doctor.getDoctorId());

        return schedules.stream().map(schedule -> docbooking.doctor.responses.Schedule.builder()
                .scheduleId(schedule.getScheduleId())
                .dateWorking(schedule.getDateWorking())
                .timeSlot(schedule.getTimeSlot().getDisplayValue())
                .slotStatus(schedule.getSlotStatus().name())
                .build()).toList();
    }

    @Transactional
    public void deleteDoctorSchedule(Integer userId, Integer scheduleId) {
        DoctorDetail doctor = doctorDetailRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin bác sĩ!"));

        DoctorSchedule schedule = doctorScheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin lịch!"));

        if(!schedule.getDoctor().getDoctorId().equals(doctor.getDoctorId())){
            throw new RuntimeException("Bạn không quyền xóa lịch trình của người khác!");
        }

        if(schedule.getSlotStatus() != DoctorSchedule.SlotStatus.AVAILABLE){
            throw new RuntimeException("Không thể xóa! Lịch trình này đã có người đặt hoặc đóng!");
        }
        doctorScheduleRepository.deleteSchedule(scheduleId);
    }
    @Transactional(readOnly = true)
    public docbooking.doctor.responses.Profile getDoctorProfile(User user) {
        DoctorDetail detail = doctorDetailRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Hồ sơ bác sĩ chưa được tạo!"));

        return docbooking.doctor.responses.Profile.builder()
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .avatarUrl(user.getAvatarUrl())
                .bio(detail.getBio())
                .degree(detail.getDegree())
                .experienceYears(detail.getExperienceYears())
                .price(detail.getPrice())
                .specialtyName(detail.getSpecialty().getSpecialtyName())
                .facilityName(detail.getFacility().getFacilityName())
                .facilityAddress(detail.getFacility().getAddress())
                .ratingAverage(detail.getRatingAverage())
                .reviewCount(detail.getReviewCount())
                .verificationStatus(detail.getVerificationStatus().name())
                .build();
    }
    @Transactional
    public docbooking.doctor.responses.Profile updateDoctorProfile(User currentUser, ChangeProfile req) {
        DoctorDetail detail = doctorDetailRepository.findByUser(currentUser)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ để cập nhật!"));
        if (req.getBio() != null) detail.setBio(req.getBio());
        if (req.getPrice() != null) detail.setPrice(req.getPrice());
        DoctorDetail savedDetail = doctorDetailRepository.save(detail);
        return getDoctorProfile(currentUser);
    }

    public Page<Review> getDoctorReviews(User user, Pageable pageable) {
        Page<docbooking.models.Review> reviewPage = reviewRepository.findByAppointment_Schedule_Doctor_UserAndIsVisibleTrueOrderByCreatedAtDesc(user, pageable);

        return reviewPage.map(reviews -> Review.builder()
                .reviewId(reviews.getReviewId())
                .rating(reviews.getRating())
                .comment(reviews.getComment())
                .patientName(reviews.getAppointment().getPatient().getFullName())
                .createdAt(reviews.getCreatedAt())
                .build());
    }

    public Page<Appointment> getDoctorAppointment(User user, Pageable pageable) {
        Page<docbooking.models.Appointment> appointmentPage = appointmentRepository.findBySchedule_Doctor_UserOrderBySchedule_DateWorkingDescSchedule_TimeSlotAsc(user, pageable);
        return appointmentPage.map(app -> {
            DoctorSchedule schedule = app.getSchedule();
            PatientProfile patient = app.getPatient();
            return Appointment.builder()
                    .appointmentId(app.getId())
                    .patientName(patient.getFullName())
                    .patientPhoneNumber(patient.getPhoneNumber())
                    .patientGender(patient.getGender() != null ? patient.getGender().name() : null)
                    .dateWorking(schedule.getDateWorking())
                    .timeSlot(schedule.getTimeSlot().name())
                    .reason(app.getReason())
                    .bookingStatus(app.getBookingStatus().name())
                    .createdAt(app.getCreatedAt())
                    .build();
        });
    }

    @Transactional
    public void updateAppointmentStatus(User user, Integer appointmentId, docbooking.models.Appointment.BookingStatus newStatus) {
        docbooking.models.Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cuộc hẹn!"));

        if(!appointment.getSchedule().getDoctor().getUser().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("Bạn không có quyền chỉnh sửa cuộc hẹn này!");
        }
        if (newStatus == docbooking.models.Appointment.BookingStatus.COMPLETED) {
            throw new RuntimeException("Vui lòng dùng chức năng 'Trả kết quả khám' để hoàn thành!");
        }

        // Kiểm tra transition hợp lệ
        docbooking.models.Appointment.BookingStatus currentStatus = appointment.getBookingStatus();
        boolean validTransition = switch (currentStatus) {
            case PENDING -> newStatus == docbooking.models.Appointment.BookingStatus.CONFIRMED
                         || newStatus == docbooking.models.Appointment.BookingStatus.CANCELLED;
            case CONFIRMED -> newStatus == docbooking.models.Appointment.BookingStatus.CANCELLED
                           || newStatus == docbooking.models.Appointment.BookingStatus.NO_SHOW;
            default -> false;
        };
        if (!validTransition) {
            throw new RuntimeException("Không thể chuyển trạng thái từ " + currentStatus + " sang " + newStatus + "!");
        }

        if (newStatus == docbooking.models.Appointment.BookingStatus.CANCELLED) {
            DoctorSchedule schedule = appointment.getSchedule();
            if (schedule != null && !schedule.getDateWorking().isBefore(LocalDate.now())) {
                schedule.setSlotStatus(DoctorSchedule.SlotStatus.AVAILABLE);
                doctorScheduleRepository.save(schedule);
            }
        }

        if (newStatus == docbooking.models.Appointment.BookingStatus.NO_SHOW) {
            appointment.setBookingStatus(docbooking.models.Appointment.BookingStatus.NO_SHOW);
            appointmentRepository.save(appointment);

            User patientUser = appointment.getPatient().getUser();
            // Đếm NO_SHOW trong 6 tháng gần nhất
            LocalDate sixMonthsAgo = LocalDate.now().minusMonths(6);
            long noShowCount = appointmentRepository.countNoShowInPeriod(
                    patientUser.getUserId(),
                    docbooking.models.Appointment.BookingStatus.NO_SHOW,
                    sixMonthsAgo);

            if (noShowCount >= 3) {
                patientUser.setIsActive(false);
                patientUser.setReasonBanned("Hệ thống tự động khóa: Không đến khám 3 lần trong 6 tháng gần nhất.");
                userRepository.save(patientUser);
            }
            return;
        }
        appointment.setBookingStatus(newStatus);
        appointmentRepository.save(appointment);
    }

    @Transactional
    public String submitMedicalResult(User doctorUser, Integer appointmentId, MedicalResult req) {

        docbooking.models.Appointment app = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn!"));
        if (app.getBookingStatus() != docbooking.models.Appointment.BookingStatus.CONFIRMED) {
            throw new RuntimeException("Lịch hẹn chưa được xác nhận hoặc đã bị hủy!");
        }
        if (!app.getSchedule().getDoctor().getUser().getUserId().equals(doctorUser.getUserId())) {
            throw new RuntimeException("Bạn không có quyền trả kết quả cho lịch hẹn này!");
        }

        if (medicalResultRepository.findByAppointmentId(appointmentId).isPresent()) {
            throw new RuntimeException("Lịch hẹn này đã có kết quả khám!");
        }

        docbooking.models.MedicalResult result = docbooking.models.MedicalResult.builder()
                .appointment(app)
                .diagnosis(req.getDiagnosis())
                .doctorNotes(req.getDoctorNotes())
                .prescriptionUrl(convertUrl.getUrlFile(req.getPrescriptionFile()))
                .build();

        medicalResultRepository.save(result);

        app.setBookingStatus(docbooking.models.Appointment.BookingStatus.COMPLETED);
        appointmentRepository.save(app);

        return "Đã trả kết quả khám thành công!";
    }

    @Transactional
    public String updateMedicalResult(User doctorUser, Integer appointmentId, MedicalResult req) {
        docbooking.models.MedicalResult result = medicalResultRepository.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new RuntimeException("Chưa có kết quả khám để chỉnh sửa!"));
        if (result.getAppointment().getBookingStatus() != docbooking.models.Appointment.BookingStatus.COMPLETED) {
            throw new RuntimeException("Không thể chỉnh sửa kết quả vì lịch hẹn không ở trạng thái hoàn thành!");
        }
        if (!result.getAppointment().getSchedule().getDoctor().getUser().getUserId().equals(doctorUser.getUserId())) {
            throw new RuntimeException("Bạn không có quyền chỉnh sửa kết quả này!");
        }

        if (req.getDiagnosis() != null) result.setDiagnosis(req.getDiagnosis());
        if (req.getDoctorNotes() != null) result.setDoctorNotes(req.getDoctorNotes());

        if (req.getPrescriptionFile() != null && !req.getPrescriptionFile().isEmpty()) {
            result.setPrescriptionUrl(convertUrl.getUrlFile(req.getPrescriptionFile()));
        }

        medicalResultRepository.save(result);
        return "Đã cập nhật kết quả khám!";
    }

    public List<Appointment> getOverdueConfirmedAppointments(User user) {
        LocalDate today = LocalDate.now();
        List<docbooking.models.Appointment> overdueAppointments = 
                appointmentRepository.findOverdueConfirmedByDoctorUserId(user.getUserId(), today);
        
        return overdueAppointments.stream().map(app -> {
            DoctorSchedule schedule = app.getSchedule();
            PatientProfile patient = app.getPatient();
            return Appointment.builder()
                    .appointmentId(app.getId())
                    .patientName(patient.getFullName())
                    .patientPhoneNumber(patient.getPhoneNumber())
                    .patientGender(patient.getGender() != null ? patient.getGender().name() : null)
                    .dateWorking(schedule.getDateWorking())
                    .timeSlot(schedule.getTimeSlot().name())
                    .reason(app.getReason())
                    .bookingStatus(app.getBookingStatus().name())
                    .createdAt(app.getCreatedAt())
                    .build();
        }).toList();
    }

}
