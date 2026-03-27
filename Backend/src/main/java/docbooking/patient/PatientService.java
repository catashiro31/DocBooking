package docbooking.patient;

import docbooking.models.*;
import docbooking.patient.requests.Relative;
import docbooking.patient.requests.Review;
import docbooking.patient.responses.AppointmentDetail;
import docbooking.repositories.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PatientService {
    private final PatientProfileRepository patientProfileRepository;
    private final AppointmentRepository appointmentRepository;
    private final DoctorScheduleRepository doctorScheduleRepository;
    private final MedicalResultRepository medicalResultRepository;
    private final ReviewRepository reviewRepository;
    private final DoctorDetailRepository doctorDetailRepository;

    public docbooking.patient.responses.Relative addRelative(User user, Relative req) {
        if (patientProfileRepository.existsByFullNameAndPhoneNumberAndUserAndIsActiveTrue(
                req.getFullName(), req.getPhoneNumber(), user)) {
            throw new RuntimeException("Người thân này đã có trong danh sách rồi");
        }
        PatientProfile profile = PatientProfile.builder()
                .fullName(req.getFullName())
                .dateOfBirth(req.getDateOfBirth())
                .gender(req.getGender())
                .phoneNumber(req.getPhoneNumber())
                .address(req.getAddress())
                .relationship(req.getRelationship())
                .user(user)
                .isActive(true)
                .build();
        return mapToResponseDTO(patientProfileRepository.save(profile));
    }

    public docbooking.patient.responses.Relative mapToResponseDTO(PatientProfile p) {
        return docbooking.patient.responses.Relative.builder()
                .patientId(p.getPatientId())
                .fullName(p.getFullName())
                .dateOfBirth(p.getDateOfBirth())
                .gender(p.getGender() != null ? p.getGender().name() : null)
                .phoneNumber(p.getPhoneNumber())
                .address(p.getAddress())
                .relationship(p.getRelationship())
                .build();
    }

    public docbooking.patient.responses.Relative getRelativeById(Integer id, User user) {
        PatientProfile profile = patientProfileRepository.findByPatientIdAndUserAndIsActiveTrue(id, user)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người thân hoặc bạn không có quyền xem hồ sơ này!"));
        return mapToResponseDTO(profile);
    }

    public List<docbooking.patient.responses.Relative> getMyRelatives(User user) {
        List<PatientProfile> profiles = patientProfileRepository.findByUserAndIsActiveTrue(user);
        return profiles.stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    public docbooking.patient.responses.Relative updateRelative(Integer id, User user, Relative req) {
        PatientProfile profile = patientProfileRepository.findByPatientIdAndUserAndIsActiveTrue(id, user)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người thân hoặc bạn không có quyền xem hồ sơ này!"));

        String newName = (req.getFullName() != null) ? req.getFullName() : profile.getFullName();
        String newNumber = (req.getPhoneNumber() != null) ? req.getPhoneNumber() : profile.getPhoneNumber();
        if (patientProfileRepository.existsByFullNameAndPhoneNumberAndUserAndIsActiveTrueAndPatientIdNot(
                newName, newNumber, user, id)) {
            throw new RuntimeException("Thông tin này bị trùng với một người thân khác trong danh sách của bạn, đổi thông tin thất bại");
        }
        if (req.getFullName() != null) profile.setFullName(req.getFullName());
        if (req.getDateOfBirth() != null) profile.setDateOfBirth(req.getDateOfBirth());
        if (req.getGender() != null) profile.setGender(req.getGender());
        if (req.getPhoneNumber() != null) profile.setPhoneNumber(req.getPhoneNumber());
        if (req.getAddress() != null) profile.setAddress(req.getAddress());
        if (req.getRelationship() != null) profile.setRelationship(req.getRelationship());

        return mapToResponseDTO(patientProfileRepository.save(profile));
    }

    @Transactional
    public void deleteRelative(User user, Integer id) {
        PatientProfile profile = patientProfileRepository.findByPatientIdAndUserAndIsActiveTrue(id, user)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ hoặc hồ sơ đã bị xóa!"));
        if ("SELF".equals(profile.getRelationship())) {
            throw new RuntimeException("Không thể xóa hồ sơ chính!");
        }
        List<Appointment.BookingStatus> activeStatuses = List.of(
                Appointment.BookingStatus.PENDING,
                Appointment.BookingStatus.CONFIRMED
        );

        if (appointmentRepository.existsByPatient_PatientIdAndBookingStatusIn(id, activeStatuses)) {
            throw new RuntimeException("Không thể xóa hồ sơ này vì đang có lịch hẹn chưa hoàn thành. Vui lòng hủy lịch hẹn trước!");
        }
        profile.setIsActive(false);
        patientProfileRepository.save(profile);
    }

    @Transactional
    public docbooking.patient.responses.Appointment createAppointment(User user, docbooking.patient.requests.Appointment req) {
        List<docbooking.models.Appointment.BookingStatus> activeStatuses = List.of(
                docbooking.models.Appointment.BookingStatus.PENDING,
                docbooking.models.Appointment.BookingStatus.CONFIRMED
        );

        long activeCount = appointmentRepository.countByPatient_User_UserIdAndBookingStatusIn(
                user.getUserId(),
                activeStatuses
        );

        if (activeCount >= 3) {
            throw new RuntimeException("Bạn chỉ được đặt tối đa 3 lịch hẹn!");
        }

        try {
            PatientProfile profile = patientProfileRepository.findByPatientIdAndUserAndIsActiveTrue(req.getPatientId(), user)
                    .orElseThrow(() -> new RuntimeException("Hồ sơ bệnh nhân này không tồn tại hoặc bạn không có quyền sử dụng!"));
            DoctorSchedule schedule = doctorScheduleRepository.findById(req.getScheduleId())
                    .orElseThrow(() -> new RuntimeException("Ca khám không tồn tại hoặc bạn không có quyền sử dụng!"));
            if (schedule.getSlotStatus() != DoctorSchedule.SlotStatus.AVAILABLE)
                throw new RuntimeException("Ca khám đã có người đặt hoặc đã đóng");
            LocalDate today = LocalDate.now();
            if (schedule.getDateWorking().isBefore(today))
                throw new RuntimeException("Không thể đặt lịch cho những ngày trong quá khứ!");
            if (appointmentRepository.existsOverlappingAppointment(
                    profile.getPatientId(),
                    schedule.getDateWorking(),
                    schedule.getTimeSlot())) {
                throw new RuntimeException("Hồ sơ bệnh nhân này đã có một lịch hẹn khác vào cùng thời gian!");
            }
            schedule.setSlotStatus(DoctorSchedule.SlotStatus.BOOKED);
            doctorScheduleRepository.save(schedule);

            docbooking.models.Appointment appointment = docbooking.models.Appointment.builder()
                    .patient(profile)
                    .schedule(schedule)
                    .reason(req.getReason())
                    .bookingStatus(docbooking.models.Appointment.BookingStatus.PENDING)
                    .createdAt(LocalDateTime.now())
                    .build();
            docbooking.models.Appointment savedAppointment = appointmentRepository.save(appointment);
            return mapToResponseDTO(savedAppointment);
        } catch (ObjectOptimisticLockingFailureException e) {
            throw new RuntimeException("Hệ thống đang bận hoặc ca khám vừa được người khác đặt nhanh hơn một chút, vui lòng thử lại!");
        }

    }
    private docbooking.patient.responses.Appointment mapToResponseDTO(docbooking.models.Appointment app) {
        var schedule = app.getSchedule();
        var doctor = schedule.getDoctor();
        var facility = doctor.getFacility();
        var specialty = doctor.getSpecialty();

        return docbooking.patient.responses.Appointment.builder()
                .appointmentId(app.getId())
                .patientName(app.getPatient().getFullName())

                .doctorName(doctor.getUser().getFullName())
                .specialtyName(specialty.getSpecialtyName())
                .facilityName(facility.getFacilityName())
                .address(facility.getAddress())

                .dateWorking(schedule.getDateWorking())
                .timeSlot(schedule.getTimeSlot().name())


                .bookingStatus(app.getBookingStatus().name())
                .createdAt(app.getCreatedAt())
                .build();

    }
    public List<docbooking.patient.responses.Appointment> getMyAppointments(User user) {
        return appointmentRepository.findByPatient_UserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }
    @Transactional
    public docbooking.patient.responses.Appointment cancelAppointment(User user, Integer id) {
        docbooking.models.Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn với ID: " + id));

        if (!appointment.getPatient().getUser().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("Bạn không có quyền hủy lịch hẹn này!");
        }

        if (appointment.getBookingStatus() == docbooking.models.Appointment.BookingStatus.CANCELLED) {
            throw new RuntimeException("Lịch hẹn này đã được hủy trước đó.");
        }
        if (appointment.getBookingStatus() == docbooking.models.Appointment.BookingStatus.COMPLETED) {
            throw new RuntimeException("Không thể hủy lịch hẹn đã hoàn thành.");
        }
        if (appointment.getBookingStatus() == docbooking.models.Appointment.BookingStatus.CONFIRMED) {
            LocalDate dateWorking = appointment.getSchedule().getDateWorking();
            if (!dateWorking.isAfter(LocalDate.now())) {
                throw new RuntimeException("Không thể hủy lịch hẹn đã xác nhận trong vòng 24h trước giờ khám. Vui lòng liên hệ hotline!");
            }
        }

        appointment.setBookingStatus(docbooking.models.Appointment.BookingStatus.CANCELLED);
        appointmentRepository.save(appointment);

        DoctorSchedule schedule = appointment.getSchedule();
        if (schedule != null) {
            schedule.setSlotStatus(DoctorSchedule.SlotStatus.AVAILABLE);
            doctorScheduleRepository.save(schedule);
        }

        return mapToResponseDTO(appointment);
    }

    public List<docbooking.patient.responses.Appointment> getPatientHistory(User user) {
        List<docbooking.models.Appointment> history = appointmentRepository
                .findByPatient_UserAndBookingStatusOrderBySchedule_DateWorkingDesc(user, docbooking.models.Appointment.BookingStatus.COMPLETED);
        return history.stream().map(app->{
            docbooking.patient.responses.Appointment dto = mapToResponseDTO(app);
            dto.setHasResult(app.getBookingStatus() == docbooking.models.Appointment.BookingStatus.COMPLETED);
            return dto;
        }).toList();
    }

    public AppointmentDetail getAppointmentDetail(User user, Integer id) {
        docbooking.models.Appointment app = appointmentRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Khoong tìm thấy lịch hẹn"));
        if (!app.getPatient().getUser().getUserId().equals(user.getUserId()))
            throw new RuntimeException("Bạn không có quyền xem chi tiết lịch hẹn này");
        docbooking.patient.responses.Appointment basicInfo = mapToResponseDTO(app);
        AppointmentDetail detailDTO = new AppointmentDetail();
        copyBasicData(basicInfo, detailDTO);
        medicalResultRepository.findByAppointmentId(id).ifPresent(res->{
            detailDTO.setDiagnosis(res.getDiagnosis());
            detailDTO.setPrescriptionUrl(res.getPrescriptionUrl());
            detailDTO.setDoctorNotes(res.getDoctorNotes());
        });
        reviewRepository.findByAppointment_Id(id).ifPresent(res->{
            detailDTO.setRating(res.getRating());
            detailDTO.setComment(res.getComment());
        });
        return detailDTO;
    }
    private void copyBasicData(docbooking.patient.responses.Appointment source, AppointmentDetail target) {
        target.setAppointmentId(source.getAppointmentId());
        target.setPatientName(source.getPatientName());
        target.setDoctorName(source.getDoctorName());
        target.setSpecialtyName(source.getSpecialtyName());
        target.setFacilityName(source.getFacilityName());
        target.setAddress(source.getAddress());
        target.setDateWorking(source.getDateWorking());
        target.setTimeSlot(source.getTimeSlot());
        target.setBookingStatus(source.getBookingStatus());
        target.setCreatedAt(source.getCreatedAt());
    }

    @Transactional
    public String saveOrUpdateReview(User user, Integer id, @Valid Review req, boolean isUpdate) {
        docbooking.models.Appointment app = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn!"));
        if (!app.getPatient().getUser().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("Bạn không có quyền đánh giá lịch hẹn này!");
        }
        if (app.getBookingStatus() != docbooking.models.Appointment.BookingStatus.COMPLETED) {
            throw new RuntimeException("Bạn chỉ có thể đánh giá sau khi đã hoàn thành buổi khám!");
        }
        Optional<docbooking.models.Review> existingReview = reviewRepository.findByAppointment_Id(id);
        docbooking.models.Review review;
        if (isUpdate) {
            // Đối với PUT: Cập nhật đánh giá cũ
            review = existingReview.orElseThrow(() -> new RuntimeException("Chưa có đánh giá nào để cập nhật!"));
        } else {
            // Đối với POST: Chặn tạo trùng và set hiển thị mặc định
            if (existingReview.isPresent()) {
                throw new RuntimeException("Lịch hẹn này đã được đánh giá rồi!");
            }
            review = new docbooking.models.Review();
            review.setAppointment(app);
            review.setIsVisible(true);
        }

        review.setRating(req.getRating());
        review.setComment(req.getComment());
        reviewRepository.save(review);

        updateDoctorStats(app.getSchedule().getDoctor().getDoctorId());

        return isUpdate ? "Cập nhật đánh giá thành công!" : "Gửi đánh giá thành công!";
    }
    private void updateDoctorStats(Integer doctorId) {
        DoctorDetail doctor = doctorDetailRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin bác sĩ."));

        List<docbooking.models.Review> reviews = reviewRepository.findByAppointment_Schedule_Doctor_DoctorId(doctorId);
        doctor.setReviewCount(reviews.size());

        double average = reviews.stream()
                .mapToInt(docbooking.models.Review::getRating)
                .average()
                .orElse(0.0);
        doctor.setRatingAverage(Math.round(average * 10.0) / 10.0);

        doctorDetailRepository.save(doctor);
    }
}