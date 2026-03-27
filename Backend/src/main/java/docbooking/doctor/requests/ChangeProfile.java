package docbooking.doctor.requests;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangeProfile {
    private String bio;
    private Double price;
}
