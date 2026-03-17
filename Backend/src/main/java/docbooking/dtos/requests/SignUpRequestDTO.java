package docbooking.dtos.requests;

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
    private User.RoleStatus role;
}