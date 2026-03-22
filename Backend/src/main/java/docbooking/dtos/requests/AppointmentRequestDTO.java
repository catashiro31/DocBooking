package docbooking.dtos.requests;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AppointmentRequestDTO {
    private Integer patientId;
    private Integer scheduleId;
    private String reason;
}
