package docbooking.dtos.requests;

import jakarta.persistence.Column;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SpecialtyRequestDTO {
    private String specialtyName;
    private String description;
    private String imageUrl;
}
