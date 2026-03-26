package docbooking.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FacilityRequestDTO {
    @NotBlank(message = "Không được để trống")
    private String address;

    private String description;

    @NotBlank(message = "Không được để trống")
    private String facilityName;

    private MultipartFile file;
}