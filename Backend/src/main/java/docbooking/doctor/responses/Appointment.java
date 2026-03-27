package docbooking.doctor.responses;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {
    private Integer appointmentId;
    private String patientName;
    private String patientPhoneNumber;
    private String patientGender;

    private LocalDate dateWorking;
    private String timeSlot;
    private String reason;

    private String bookingStatus;
    private LocalDateTime createdAt;
}