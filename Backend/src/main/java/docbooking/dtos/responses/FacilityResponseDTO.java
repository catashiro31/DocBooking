package docbooking.dtos.responses;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FacilityResponseDTO {
    private Integer id;
    private String name;
    private String address;
    private String description;
    private String imageUrl;
}
