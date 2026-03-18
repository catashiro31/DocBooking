package docbooking.services;

import docbooking.dtos.requests.SignUpRequestDTO;
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
        this.passwordEncoder = passwordEncoder;
    }

    public User signUp(SignUpRequestDTO req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng!");
        }

        // 2. Tạo User mới
        User newUser = new User();
        newUser.setFullName(req.getFullName());
        newUser.setEmail(req.getEmail());

        newUser.setPasswordHash(passwordEncoder.encode(req.getPassword()));

        User.RoleStatus userRole = User.RoleStatus.PATIENT;

        if (req.getRole() != null && !req.getRole().isEmpty()) {
            try {
                userRole = User.RoleStatus.valueOf(req.getRole().toUpperCase());
            } catch (IllegalArgumentException e) {
                userRole = User.RoleStatus.PATIENT;
            }
        }
        newUser.setRole(userRole);
        return userRepository.save(newUser);
    }
}