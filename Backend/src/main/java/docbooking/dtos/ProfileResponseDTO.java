package docbooking.dtos;

import docbooking.models.User;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor // Bắt buộc phải có để Builder hoạt động
@NoArgsConstructor
public class ProfileResponseDTO {
    private String email;
    private String fullName;
    private String phoneNumber;
    private String avatarUrl;
}
