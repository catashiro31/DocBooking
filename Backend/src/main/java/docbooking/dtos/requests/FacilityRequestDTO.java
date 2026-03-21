package docbooking.dtos.requests;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FacilityRequestDTO {
    private String address;
    private String description;
    private String facilityName;
    private String imageUrl;
}
