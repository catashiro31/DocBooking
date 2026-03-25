package docbooking.dtos.requests;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangeDoctorProfileRequestDTO {
    private String bio;
    private Double price;
}
