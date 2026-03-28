package docbooking.patient.responses;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentDetail extends Appointment {
    private String diagnosis;
    private String prescriptionUrl;
    private String doctorNotes;

    private Integer rating;
    private String comment;
}
