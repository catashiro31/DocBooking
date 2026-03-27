package docbooking.utils;

import docbooking.models.Appointment;
import docbooking.models.DoctorSchedule;
import docbooking.models.User;
import docbooking.repositories.AppointmentRepository;
import docbooking.repositories.UserRepository;
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
    private final UserRepository userRepository;
    // Chạy vào 1 giờ sáng mỗi ngày để dọn dẹp lịch của ngày hôm qua
    @Scheduled(cron = "0 0 1 * * ?")
    @Transactional
    public void cancelPastDueAppointments() {
        LocalDate today = LocalDate.now();
        List<Appointment> pastDue =
                appointmentRepository.findPastDueAppointments(today);//lay cac lich hen qua han

        if (pastDue.isEmpty()) {
            return;
        }

        log.info("Phát hiện {} lịch hẹn quá hạn. Đang xử lý...", pastDue.size());

        for (Appointment app : pastDue) {
            if (app.getBookingStatus() == Appointment.BookingStatus.PENDING) {
                // Bác sĩ quên duyệt -> Chỉ hủy lịch, không phạt bệnh nhân
                app.setBookingStatus(Appointment.BookingStatus.CANCELLED);
            }
            else if (app.getBookingStatus() == Appointment.BookingStatus.CONFIRMED) {
                // Đã duyệt mà không khám -> Bệnh nhân không đến
                app.setBookingStatus(Appointment.BookingStatus.NO_SHOW);
                appointmentRepository.save(app);

                // 2. Logic kiểm tra và khóa tài khoản
                User patientUser = app.getPatient().getUser();
                long noShowCount = appointmentRepository.countByPatient_User_UserIdAndBookingStatus(
                        patientUser.getUserId(),
                        Appointment.BookingStatus.NO_SHOW
                );

                if (noShowCount >= 3) {
                    patientUser.setIsActive(false);
                    patientUser.setReasonBanned("Hệ thống tự động khóa: Không đến khám quá 3 lần.");
                    userRepository.save(patientUser);
                    log.warn("Đã khóa tài khoản User ID: {} do quá 3 lần NO_SHOW", patientUser.getUserId());
                }
            }

            appointmentRepository.save(app);

            // 3. Đóng khung giờ khám của ngày cũ
            if (app.getSchedule() != null) {
                app.getSchedule().setSlotStatus(DoctorSchedule.SlotStatus.CLOSED);
            }
        }
        log.info("Dọn dẹp và xử lý vi phạm hoàn tất!");
    }
}