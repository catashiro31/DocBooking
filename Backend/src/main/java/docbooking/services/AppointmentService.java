package docbooking.services;

import docbooking.dtos.requests.AppointmentRequestDTO;
import docbooking.dtos.responses.AppointmentResponseDTO;
import docbooking.models.Appointment;
import docbooking.models.DoctorSchedule;
import docbooking.models.PatientProfile;
import docbooking.models.User;
import docbooking.repositories.AppointmentRepository;
import docbooking.repositories.DoctorScheduleRepository;
import docbooking.repositories.PatientProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final PatientProfileRepository patientProfileRepository;
    private final DoctorScheduleRepository doctorScheduleRepository;

    @Transactional
    public AppointmentResponseDTO createAppointment(User user, AppointmentRequestDTO req) {
        PatientProfile profile = patientProfileRepository.findByPatientIdAndUser(req.getPatientId(), user)
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
}
