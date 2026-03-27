package docbooking.dtos.responses;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter @Setter @Builder
@AllArgsConstructor @NoArgsConstructor
public class AppointmentResponseDTO {
    private Integer appointmentId;
    private String patientName;

    private String doctorName;
    private String specialtyName;
    private String facilityName;
    private String address;

    private LocalDate dateWorking;
    private String timeSlot;
    private String bookingStatus;
    private LocalDateTime createdAt;

    private boolean hasResult;
}
