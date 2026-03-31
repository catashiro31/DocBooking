package docbooking.doctor.requests;

import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangeProfile {
    private String bio;

    @Min(value = 0, message = "Giá khám không được là số âm")
    private Double price;
}
