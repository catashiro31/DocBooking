package docbooking.dtos.responses;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class StatResponseDTO {
    private long numberOfDoctors;
    private long numberOfPatients;
    private long numberOfSuccessAppointments;
    private long numberOfPendingAppointments;
    private long numberOfFailingAppointments;
}
