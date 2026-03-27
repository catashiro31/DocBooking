package docbooking.admin.responses;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentStats {
    private long completed;
    private long pending;
    private long cancelled;
}