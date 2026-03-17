package docbooking.dtos.responses;

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
