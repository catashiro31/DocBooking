package docbooking.dtos.responses;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorAppointmentResponseDTO{
    private Integer appointmentId;
    private String patientName;
    private String patientPhoneNumber;
    private String patientGender;

    private LocalDate dateWorking;
    private String timeSlot;
    private String reason;

    private String bookingStatus;
    private String paymentStatus;
    private LocalDateTime createdAt;
}