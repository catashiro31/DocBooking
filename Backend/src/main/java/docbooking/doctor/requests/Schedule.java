package docbooking.doctor.requests;

import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Schedule {
    private LocalDate date;
    private List<String> slotIds;
}
