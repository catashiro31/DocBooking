package docbooking.dtos;

import docbooking.models.User;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SignUpRequestDTO {
    private String email;
    private String password;
    private String fullName;
    private String phoneNumber;
    private User.RoleStatus role;
    private String avatarUrl;
}