package docbooking.services;

import com.zaxxer.hikari.HikariDataSource;
import docbooking.dtos.requests.AppointmentRequestDTO;
import docbooking.dtos.responses.AppointmentDetailDTO;
import docbooking.dtos.responses.AppointmentResponseDTO;
import docbooking.models.Appointment;
import docbooking.models.DoctorSchedule;
import docbooking.models.PatientProfile;
import docbooking.models.User;
import docbooking.repositories.*;
import docbooking.utils.FileUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final PatientProfileRepository patientProfileRepository;
    private final DoctorScheduleRepository doctorScheduleRepository;
    private final HikariDataSource hikariDataSource;
    private final MedicalResultRepository medicalResultRepository;
    private final ReviewRepository reviewRepository;
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

    @Transactional
    public String uploadPaymentProof(Integer id, MultipartFile file) {
        String urlFile = fileUtil.getUrlFile(file);

        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn với ID: " + id));

        appointment.setPaymentEvidenceUrl(urlFile);

        appointment.setPaymentStatus(Appointment.PaymentStatus.PENDING_CHECK);
        appointmentRepository.save(appointment);
        return "Đã Upload minh chứng thanh toán thành công!";
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
}
