package docbooking.user;

import com.cloudinary.Cloudinary;
import docbooking.auth.requests.ChangePassword;
import docbooking.models.User;
import docbooking.repositories.UserRepository;
import docbooking.user.requests.UpdateProfile;
import docbooking.user.responses.Profile;
import docbooking.utils.ConvertUrl;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ConvertUrl convertUrl;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, Cloudinary cloudinary, ConvertUrl convertUrl) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.convertUrl = convertUrl;
    }

    public Profile getProfile(UserDetails userDetails) {
        String email = userDetails.getUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với email: " + email));
        return Profile.builder()
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .avatarUrl(user.getAvatarUrl())
                .build();
    }

    public Profile updateProfile(User user, UpdateProfile req) {
        // 1. Cập nhật thông tin Text
        if (req.getFullName() != null && !req.getFullName().isBlank()) {
            user.setFullName(req.getFullName());
        }
        if (req.getPhoneNumber() != null && !req.getPhoneNumber().isBlank()) {
            user.setPhoneNumber(req.getPhoneNumber());
        }

        user.setAvatarUrl(convertUrl.getUrlFile(req.getFile()));
        User updatedUser = userRepository.save(user);

        return Profile.builder()
                .email(updatedUser.getEmail())
                .fullName(updatedUser.getFullName())
                .phoneNumber(updatedUser.getPhoneNumber())
                .avatarUrl(updatedUser.getAvatarUrl())
                .build();
    }

    public void changePassword(User user, ChangePassword req) {
        if (!passwordEncoder.matches(req.getOldPassword(), user.getPasswordHash())){
            throw new RuntimeException("Mật khẩu cũ không chính xác");
        }
        user.setPasswordHash(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);
    }
}
