package docbooking.admin.responses;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class Stat {
    // Counts in period
    private long numberOfDoctors;
    private long numberOfPatients;
    private long numberOfSuccessAppointments;
    private long numberOfPendingAppointments;
    private long numberOfFailingAppointments;

    // Absolute totals
    private long totalUsers;
    private long totalDoctors;
    private long totalPatients;
    private long totalAppointments;
    private long pendingDoctors;
    private long todayAppointments;
    private long totalReviews;
}
