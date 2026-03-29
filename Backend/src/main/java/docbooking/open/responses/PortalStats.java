package docbooking.open.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PortalStats {
    private long totalDoctors;
    private long totalAppointments;
    private double averageRating;
}
