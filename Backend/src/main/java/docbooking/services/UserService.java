package docbooking.services;

import docbooking.dtos.requests.ChangePasswordRequestDTO;
import docbooking.dtos.requests.UpdateProfileRequestDTO;
import docbooking.dtos.responses.ProfileResponseDTO;
import docbooking.models.User;
import docbooking.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }

    public ProfileResponseDTO getProfile(UserDetails userDetails) {
        String email = userDetails.getUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với email: " + email));
        return ProfileResponseDTO.builder()
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .avatarUrl(user.getAvatarUrl())
                .build();
    }

    public ProfileResponseDTO updateProfile(User user, UpdateProfileRequestDTO req) {
        if (req.getFullName() != null && !req.getFullName().isBlank()) {
            user.setFullName(req.getFullName());
        }
        if (req.getPhoneNumber() != null && !req.getPhoneNumber().isBlank()) {
            user.setPhoneNumber(req.getPhoneNumber());
        }
        if (req.getAvatarUrl() != null && !req.getAvatarUrl().isBlank()) {
            user.setAvatarUrl(req.getAvatarUrl());
        }
        User updatedUser = userRepository.save(user);
        return  ProfileResponseDTO.builder()
                .email(updatedUser.getEmail())
                .fullName(updatedUser.getFullName())
                .phoneNumber(updatedUser.getPhoneNumber())
                .avatarUrl(updatedUser.getAvatarUrl())
                .build();
    }

    public void changePassword(User user, ChangePasswordRequestDTO req) {
        if (!passwordEncoder.matches(req.getOldPassword(), user.getPasswordHash())){
            throw new RuntimeException("Mật khẩu cũ không chính xác");
        }
        user.setPasswordHash(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);
    }
}
