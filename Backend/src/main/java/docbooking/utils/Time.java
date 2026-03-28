package docbooking.utils;

import docbooking.models.DoctorSchedule;
import java.time.LocalTime;

public class Time {
    //Chuyển đổi Enum TimeSlot (ví dụ: SLOT_09_30) thành LocalTime (09:30)
    public static LocalTime parseTimeSlot(DoctorSchedule.TimeSlot timeSlot) {
        try {
            // SLOT_09_30 -> 09:30
            String timeStr = timeSlot.name().replace("SLOT_", "").replace("_", ":");
            return LocalTime.parse(timeStr);
        } catch (Exception e) {
            // Trả về 0 giờ nếu có lỗi
            return LocalTime.MIDNIGHT;
        }
    }
}