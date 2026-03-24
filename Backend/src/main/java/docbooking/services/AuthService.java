package docbooking.services;

import docbooking.dtos.requests.SignInRequestDTO;
import docbooking.dtos.requests.SignUpRequestDTO;
import docbooking.dtos.responses.SignInResponseDTO;
import docbooking.models.PatientProfile;
import docbooking.models.User;
import docbooking.repositories.PatientProfileRepository;
import docbooking.repositories.UserRepository;
import docbooking.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final PatientProfileRepository patientProfileRepository;

    public SignInResponseDTO signIn(SignInRequestDTO req) {
        if (!userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Tài khoản hông tồn tại");
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
            );

            String jwt = jwtTokenProvider.createToken(authentication);
            long expiration = jwtTokenProvider.getJwtExpiration();
            return new SignInResponseDTO(jwt, expiration);

        } catch (BadCredentialsException e) {
            throw new RuntimeException("Sai mật khẩu");
        }
    }
    @Transactional
    public User signUp(SignUpRequestDTO req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng!");
        }

        User newUser = User.builder()
                .email(req.getEmail())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .fullName(req.getFullName())
                .phoneNumber(req.getPhoneNumber())
                .role(req.getRole())
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .build();

        User savedUser = userRepository.save(newUser);
        if (savedUser.getRole() == User.RoleStatus.PATIENT) {
            PatientProfile selfProfile = PatientProfile.builder()
                    .fullName(savedUser.getFullName())
                    .phoneNumber(savedUser.getPhoneNumber())
                    .relationship("SELF") // Đánh dấu đây là hồ sơ chính bản thân mình
                    .user(savedUser) // Liên kết với tài khoản vừa tạo
                    .build();

            patientProfileRepository.save(selfProfile);
        }
        return savedUser;
    }
}