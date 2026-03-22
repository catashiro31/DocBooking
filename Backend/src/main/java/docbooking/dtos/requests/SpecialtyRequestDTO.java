package docbooking.dtos.requests;

import jakarta.persistence.Column;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SpecialtyRequestDTO {
    private String specialName;
    private String description;
    private String imageUrl;
}
