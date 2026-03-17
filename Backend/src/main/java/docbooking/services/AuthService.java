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

        newUser.setRoleStatus(req.getRole());
        return userRepository.save(newUser);
    }
}