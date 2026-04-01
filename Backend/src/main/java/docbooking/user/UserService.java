package docbooking.user;

import docbooking.auth.requests.ChangePassword;
import docbooking.models.User;
import docbooking.repositories.UserRepository;
import docbooking.user.requests.UpdateProfile;
import docbooking.user.responses.Profile;
import docbooking.utils.ConvertUrl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ConvertUrl convertUrl;

    public Profile getProfile(UserDetails userDetails) {
        String email = userDetails.getUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với email: " + email));
        return Profile.builder()
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole() != null ? user.getRole().name() : null)
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

        if (req.getFile() != null && !req.getFile().isEmpty()) {
            convertUrl.validateFile(req.getFile(), "Ảnh đại diện", "image/jpeg", "image/png");
            user.setAvatarUrl(convertUrl.getUrlFile(req.getFile()));
        }
        User updatedUser = userRepository.save(user);

        return Profile.builder()
                .email(updatedUser.getEmail())
                .fullName(updatedUser.getFullName())
                .phoneNumber(updatedUser.getPhoneNumber())
                .avatarUrl(updatedUser.getAvatarUrl())
                .role(updatedUser.getRole() != null ? updatedUser.getRole().name() : null)
                .build();
    }

    public void changePassword(User user, ChangePassword req) {
        if (!passwordEncoder.matches(req.getOldPassword(), user.getPasswordHash())){
            throw new RuntimeException("Mật khẩu cũ không chính xác");
        }
        if (passwordEncoder.matches(req.getNewPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Mật khẩu mới phải khác mật khẩu cũ!");
        }
        user.setPasswordHash(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);
    }
}
