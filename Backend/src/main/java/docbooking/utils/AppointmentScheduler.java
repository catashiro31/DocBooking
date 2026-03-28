package docbooking.utils;

import docbooking.models.Appointment;
import docbooking.models.DoctorSchedule;
import docbooking.models.User;
import docbooking.repositories.AppointmentRepository;
import docbooking.repositories.UserRepository;
import docbooking.repositories.DoctorScheduleRepository; // Đã thêm
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class AppointmentScheduler {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final DoctorScheduleRepository doctorScheduleRepository; // Đã thêm


    @Scheduled(fixedRate = 900000)
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

    private void processAppointments(List<Appointment> pastDue) {
        for (Appointment app : pastDue) {
            // Bác sĩ quên duyệt -> Chỉ hủy lịch
            if (app.getBookingStatus() == Appointment.BookingStatus.PENDING) {
                app.setBookingStatus(Appointment.BookingStatus.CANCELLED);
            }
            // Đã duyệt mà không khám -> Bệnh nhân không đến
            else if (app.getBookingStatus() == Appointment.BookingStatus.CONFIRMED) {
                app.setBookingStatus(Appointment.BookingStatus.NO_SHOW);
                appointmentRepository.save(app);

                // Kiểm tra số lần vi phạm để khóa tài khoản
                User patientUser = app.getPatient().getUser();
                long noShowCount = appointmentRepository.countByPatient_User_UserIdAndBookingStatus(
                        patientUser.getUserId(),
                        Appointment.BookingStatus.NO_SHOW
                );

                // Nếu quá 3 thì khóa tài khoản
                if (noShowCount >= 3) {
                    patientUser.setIsActive(false);
                    patientUser.setReasonBanned("Hệ thống tự động khóa: Không đến khám quá 3 lần.");
                    userRepository.save(patientUser);
                    log.warn("Đã khóa tài khoản User ID: {} do vi phạm NO_SHOW 3 lần", patientUser.getUserId());
                }
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