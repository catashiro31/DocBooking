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
                .createdAt(LocalDateTime.now())
                .build();
        Appointment savedAppointment = appointmentRepository.save(appointment);
        return mapToResponseDTO(savedAppointment);
    }
    private AppointmentResponseDTO mapToResponseDTO(Appointment app) {
        // Để code gọn hơn, mình lấy các đối tượng liên quan ra trước
        var schedule = app.getSchedule();
        var doctor = schedule.getDoctor();
        var facility = doctor.getFacility();
        var specialty = doctor.getSpecialty();

        return AppointmentResponseDTO.builder()
                .appointmentId(app.getId())
                .patientName(app.getPatient().getFullName())

                // Thông tin bác sĩ và địa điểm
                .doctorName(doctor.getUser().getFullName())
                .specialtyName(specialty.getSpecialtyName())
                .facilityName(facility.getFacilityName())
                .address(facility.getAddress())

                // Thời gian
                .dateWorking(schedule.getDateWorking())
                .timeSlot(schedule.getTimeSlot().name())

                // Trạng thái và tiền nong
                .totalAmount(app.getTotalAmount())
                .bookingStatus(app.getBookingStatus().name()) // Chuyển Enum thành String
                .paymentStatus(app.getPaymentStatus().name())
                .createdAt(app.getCreatedAt())
                .build();

    }
}
