package docbooking.services;

import com.zaxxer.hikari.HikariDataSource;
import docbooking.dtos.requests.AppointmentRequestDTO;
import docbooking.dtos.requests.ReviewRequestDTO;
import docbooking.dtos.responses.AppointmentDetailDTO;
import docbooking.dtos.responses.AppointmentResponseDTO;
import docbooking.models.*;
import docbooking.repositories.*;
import docbooking.utils.FileUtil;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final PatientProfileRepository patientProfileRepository;
    private final DoctorScheduleRepository doctorScheduleRepository;
    private final HikariDataSource hikariDataSource;
    private final MedicalResultRepository medicalResultRepository;
    private final ReviewRepository reviewRepository;
    private final DoctorDetailRepository doctorDetailRepository;
    private final FileUtil fileUtil;

    @Transactional
    public AppointmentResponseDTO createAppointment(User user, AppointmentRequestDTO req) {
        PatientProfile profile = patientProfileRepository.findByPatientIdAndUserAndIsActiveTrue(req.getPatientId(), user)
                .orElseThrow(() -> new RuntimeException("Hồ sơ bệnh nhân này không tồn tại hoặc bạn không có quyền sử dụng!"));
        DoctorSchedule schedule = doctorScheduleRepository.findById(req.getScheduleId())
                .orElseThrow(()->new RuntimeException("Ca khám không tồn tại hoặc bạn không có quyền sử dụng!"));
        if (schedule.getSlotStatus() != DoctorSchedule.SlotStatus.AVAILABLE)
            throw new RuntimeException("Ca khám đã có người đặt hoặc đã đóng");
        LocalDate today = LocalDate.now();
        if (schedule.getDateWorking().isBefore(today))
            throw new RuntimeException("Không thể đặt lịch cho những ngày trong quá khứ!");
        schedule.setSlotStatus(DoctorSchedule.SlotStatus.BOOKED);
        doctorScheduleRepository.save(schedule);

        Appointment appointment = Appointment.builder()
                .patient(profile)
                .schedule(schedule)
                .reason(req.getReason())
                .bookingStatus(Appointment.BookingStatus.PENDING)
                .paymentStatus(Appointment.PaymentStatus.UNPAID)
                .totalAmount(schedule.getDoctor().getPrice())
                .holdExpiresAt(LocalDateTime.now().plusHours(2))
                .createdAt(LocalDateTime.now())
                .build();
        Appointment savedAppointment = appointmentRepository.save(appointment);
        return mapToResponseDTO(savedAppointment);
    }
    private AppointmentResponseDTO mapToResponseDTO(Appointment app) {
        var schedule = app.getSchedule();
        var doctor = schedule.getDoctor();
        var facility = doctor.getFacility();
        var specialty = doctor.getSpecialty();

        return AppointmentResponseDTO.builder()
                .appointmentId(app.getId())
                .patientName(app.getPatient().getFullName())

                .doctorName(doctor.getUser().getFullName())
                .specialtyName(specialty.getSpecialtyName())
                .facilityName(facility.getFacilityName())
                .address(facility.getAddress())

                .dateWorking(schedule.getDateWorking())
                .timeSlot(schedule.getTimeSlot().name())

                .totalAmount(app.getTotalAmount())
                .bookingStatus(app.getBookingStatus().name())
                .paymentStatus(app.getPaymentStatus().name())
                .createdAt(app.getCreatedAt())
                .build();

    }
    public List<AppointmentResponseDTO> getMyAppointments(User user) {
        return appointmentRepository.findByPatient_UserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }
    @Transactional
    public AppointmentResponseDTO cancelAppointment(User user, Integer id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn với ID: " + id));

        if (!appointment.getPatient().getUser().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("Bạn không có quyền hủy lịch hẹn này!");
        }

        if (appointment.getBookingStatus() == Appointment.BookingStatus.CANCELLED) {
            throw new RuntimeException("Lịch hẹn này đã được hủy trước đó.");
        }
        if (appointment.getBookingStatus() == Appointment.BookingStatus.COMPLETED) {
            throw new RuntimeException("Không thể hủy lịch hẹn đã hoàn thành.");
        }

        appointment.setBookingStatus(Appointment.BookingStatus.CANCELLED);
        appointmentRepository.save(appointment);

        DoctorSchedule schedule = appointment.getSchedule();
        schedule.setSlotStatus(DoctorSchedule.SlotStatus.AVAILABLE);
        doctorScheduleRepository.save(schedule);

        return mapToResponseDTO(appointment);
    }

    public List<AppointmentResponseDTO> getPatientHistory(User user) {
        List<Appointment> history = appointmentRepository
             .findByPatient_UserAndBookingStatusOrderBySchedule_DateWorkingDesc(user, Appointment.BookingStatus.COMPLETED);
        return history.stream().map(app->{
            AppointmentResponseDTO dto = mapToResponseDTO(app);
            dto.setHasResult(app.getBookingStatus() == Appointment.BookingStatus.COMPLETED);
            return dto;
        }).toList();
    }

    public AppointmentDetailDTO getAppointmentDetail(User user, Integer id) {
        Appointment app = appointmentRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Khoong tìm thấy lịch hẹn"));
        if (!app.getPatient().getUser().getUserId().equals(user.getUserId()))
            throw new RuntimeException("Bạn không có quyền xem chi tiết lịch hẹn này");
        AppointmentResponseDTO basicInfo = mapToResponseDTO(app);
        AppointmentDetailDTO detailDTO = new AppointmentDetailDTO();
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
    private void copyBasicData(AppointmentResponseDTO source, AppointmentDetailDTO target) {
        target.setAppointmentId(source.getAppointmentId());
        target.setPatientName(source.getPatientName());
        target.setDoctorName(source.getDoctorName());
        target.setSpecialtyName(source.getSpecialtyName());
        target.setFacilityName(source.getFacilityName());
        target.setAddress(source.getAddress());
        target.setDateWorking(source.getDateWorking());
        target.setTimeSlot(source.getTimeSlot());
        target.setTotalAmount(source.getTotalAmount());
        target.setBookingStatus(source.getBookingStatus());
        target.setPaymentStatus(source.getPaymentStatus());
        target.setCreatedAt(source.getCreatedAt());
    }

    @Transactional
    public String saveOrUpdateReview(User user, Integer id, @Valid ReviewRequestDTO req, boolean isUpdate) {
        Appointment app = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn!"));
        if (!app.getPatient().getUser().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("Bạn không có quyền đánh giá lịch hẹn này!");
        }
        if (app.getBookingStatus() != Appointment.BookingStatus.COMPLETED) {
            throw new RuntimeException("Bạn chỉ có thể đánh giá sau khi đã hoàn thành buổi khám!");
        }
        Optional<Review> existingReview = reviewRepository.findByAppointment_Id(id);
        Review review;
        if (isUpdate) {
            // Đối với PUT: Cập nhật đánh giá cũ
            review = existingReview.orElseThrow(() -> new RuntimeException("Chưa có đánh giá nào để cập nhật!"));
        } else {
            // Đối với POST: Chặn tạo trùng và set hiển thị mặc định
            if (existingReview.isPresent()) {
                throw new RuntimeException("Lịch hẹn này đã được đánh giá rồi!");
            }
            review = new Review();
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

        List<Review> reviews = reviewRepository.findByAppointment_Schedule_Doctor_DoctorId(doctorId);
        doctor.setReviewCount(reviews.size());

        double average = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
        doctor.setRatingAverage(Math.round(average * 10.0) / 10.0);

        doctorDetailRepository.save(doctor);
    }

    public String uploadPaymentImage(Integer id, MultipartFile file) {
        String url = fileUtil.getUrlFile(file);
        Appointment app = appointmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy cuộc hẹn mã: " + id));
        app.setPaymentEvidenceUrl(url);
        app.setPaymentStatus(Appointment.PaymentStatus.PENDING_CHECK);
        return "Minh chứng thanh toán đã được gửi";
    }
}
