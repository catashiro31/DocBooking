package docbooking.dtos.requests;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequestDTO {
    private String fullName;
    private String phoneNumber;
    private String avatarUrl;
}
