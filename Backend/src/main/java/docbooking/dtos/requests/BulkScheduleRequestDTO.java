package docbooking.dtos.requests;

import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BulkScheduleRequestDTO {
    private LocalDate date;
    private List<String> slotIds;
}
