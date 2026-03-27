package docbooking.doctor.responses;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Schedule {
    private Integer scheduleId;
    private LocalDate dateWorking;
    private String timeSlot;
    private String slotStatus;
}
