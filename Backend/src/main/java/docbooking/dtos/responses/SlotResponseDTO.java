package docbooking.dtos.responses;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SlotResponseDTO {
    private Integer scheduleId;
    private String timeSlot;
    private String slotStatus;
}
