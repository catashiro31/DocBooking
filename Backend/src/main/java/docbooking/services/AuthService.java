package docbooking.services;

import docbooking.dtos.SignUpRequestDTO;
import docbooking.models.User;
import docbooking.repositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder ;
    }

    public User createUser(SignUpRequestDTO request) {

        if (request.getRole() == User.RoleStatus.ADMIN) {
            throw new IllegalArgumentException("Hành vi bị từ chối: Không được phép tạo tài khoản Quản trị viên!");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email này đã được sử dụng!");
        }

        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new IllegalArgumentException("Số điện thoại đã được sử dụng!");
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());

        User newUser = User.builder()
                .email(request.getEmail())
                .passwordHash(encodedPassword)
                .fullName(request.getFullName())
                .phoneNumber(request.getPhoneNumber())
                .role(request.getRole())
                .avatarUrl(request.getAvatarUrl())
                .isActive(true)
                .build();

        return userRepository.save(newUser);
    }
}
