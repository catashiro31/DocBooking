package docbooking.dtos.responses;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentDetailDTO extends AppointmentResponseDTO{
    private String diagnosis;
    private String prescriptionUrl;
    private String doctorNotes;
    private LocalDateTime resultCreatedAt;

    private Integer rating;
    private String comment;
}
