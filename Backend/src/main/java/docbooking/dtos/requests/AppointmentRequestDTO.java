package docbooking.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AppointmentRequestDTO {
    @NotNull(message = "Không được để trống")
    private Integer patientId;

    @NotNull(message = "Không đươc để trống")
    private Integer scheduleId;

    @NotBlank(message = "Không được để trống lý do đặt")
    private String reason;
}
