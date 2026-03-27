package docbooking.user.responses;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Profile {
    private String email;
    private String fullName;
    private String phoneNumber;
    private String avatarUrl;
}
