package docbooking.dtos;

import docbooking.models.User;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProfileResponseDTO {
    private String email;
    private String fullName;
    private String phoneNumber;
    private String avatarUrl;

    public ProfileResponseDTO(User user) {
        this.email = user.getEmail();
        this.fullName = user.getFullName();
        this.phoneNumber = user.getPhoneNumber();
        this.avatarUrl = user.getAvatarUrl();
    }
}
