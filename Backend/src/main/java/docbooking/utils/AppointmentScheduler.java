package docbooking.utils;

import docbooking.models.Appointment;
import docbooking.models.DoctorSchedule;
import docbooking.repositories.AppointmentRepository;
import docbooking.repositories.DoctorScheduleRepository;
import docbooking.repositories.TokenBlacklistRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class AppointmentScheduler {

    private final AppointmentRepository appointmentRepository;
    private final DoctorScheduleRepository doctorScheduleRepository;
    private final TokenBlacklistRepository tokenBlacklistRepository;


    @Scheduled(cron = "0 0 1 * * ?")
    @Transactional
    public void cleanupSystem() {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        log.info("--- Bắt đầu tiến trình dọn dẹp hệ thống: {} ---", now);
        // Đóng các khung giờ trống của những ngày đã qua
        doctorScheduleRepository.closePastDaysSlots(today);
        //  Đóng các khung giờ trống của chính hôm nay nhưng đã quá giờ thực tế
        List<DoctorSchedule> todayAvailableSlots =
                doctorScheduleRepository.findByDateWorkingAndSlotStatus(today, DoctorSchedule.SlotStatus.AVAILABLE);

        for (DoctorSchedule slot : todayAvailableSlots) {
            if (isSlotExpired(slot.getTimeSlot(), now)) {
                slot.setSlotStatus(DoctorSchedule.SlotStatus.CLOSED);
                doctorScheduleRepository.save(slot);
            }
        }
        //  Xử lý các lịch hẹn đã quá hạn
        List<Appointment> pastDue = appointmentRepository.findPastDueAppointments(today);

        if (!pastDue.isEmpty()) {
            log.info("Phát hiện {} lịch hẹn quá hạn. Đang xử lý vi phạm...", pastDue.size());
            processAppointments(pastDue);
        }

        log.info("--- Dọn dẹp hoàn tất! ---");
    }

    @Scheduled(cron = "0 0 2 ? * SUN")
    @Transactional
    public void cleanupTokenBlacklist() {
        log.info("--- Bắt đầu dọn dẹp token blacklist ---");
        tokenBlacklistRepository.deleteExpiredTokens(LocalDateTime.now());
        log.info("--- Dọn dẹp token blacklist hoàn tất! ---");
    }

    private void processAppointments(List<Appointment> pastDue) {
        for (Appointment app : pastDue) {
            // Bác sĩ quên duyệt -> Tự động hủy lịch
            if (app.getBookingStatus() == Appointment.BookingStatus.PENDING) {
                app.setBookingStatus(Appointment.BookingStatus.CANCELLED);
            }

            // Đóng khung giờ khám liên quan đến lịch hẹn này
            if (app.getSchedule() != null) {
                app.getSchedule().setSlotStatus(DoctorSchedule.SlotStatus.CLOSED);
            }
            appointmentRepository.save(app);
        }
    }

    private boolean isSlotExpired(DoctorSchedule.TimeSlot timeSlot, LocalTime now) {
        return Time.parseTimeSlot(timeSlot).isBefore(now);
    }
}