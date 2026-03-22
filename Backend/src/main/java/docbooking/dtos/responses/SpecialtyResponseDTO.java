package docbooking.dtos.responses;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SpecialtyResponseDTO {
    private Integer id;
    private String name;
    private String description;
    private String imageUrl;
}
