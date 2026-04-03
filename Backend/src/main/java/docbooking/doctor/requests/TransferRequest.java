package docbooking.doctor.requests;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class TransferRequest {
    private Integer targetFacilityId;
    private String reason;
}
