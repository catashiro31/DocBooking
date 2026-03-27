package docbooking.open.responses;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorSlots {
    private Integer scheduleId;
    private String timeSlot;
    private String slotStatus;
}
