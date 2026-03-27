package docbooking.utils;

import docbooking.models.Appointment;
import docbooking.models.DoctorSchedule;
import docbooking.repositories.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class AppointmentScheduler {

    private final AppointmentRepository appointmentRepository;

    // Chạy vào 1 giờ sáng mỗi ngày để dọn dẹp lịch của ngày hôm qua
    @Scheduled(cron = "0 0 1 * * ?")
    @Transactional
    public void cancelPastDueAppointments() {
        LocalDate today = LocalDate.now();
        List<Appointment> pastDue = appointmentRepository.findPastDueAppointments(today);

        if (pastDue.isEmpty()) {
            return;
        }

        log.info("Phát hiện {} lịch hẹn quá hạn (quên duyệt hoặc khách không đến). Tiến hành hủy...", pastDue.size());

        for (Appointment app : pastDue) {
            app.setBookingStatus(Appointment.BookingStatus.CANCELLED);
            appointmentRepository.save(app);

            if (app.getSchedule() != null) {
                app.getSchedule().setSlotStatus(DoctorSchedule.SlotStatus.CLOSED);
            }
        }
        log.info("Dọn dẹp lịch quá hạn hoàn tất!");
    }
}