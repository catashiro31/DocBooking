package docbooking.services;

import docbooking.dtos.requests.SignInRequestDTO;
import docbooking.dtos.requests.SignUpRequestDTO;
import docbooking.dtos.responses.SignInResponseDTO;
import docbooking.models.PatientProfile;
import docbooking.models.User;
import docbooking.repositories.PatientProfileRepository;
import docbooking.repositories.UserRepository;
import docbooking.security.JwtTokenProvider;
import docbooking.utils.EmailUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final PatientProfileRepository patientProfileRepository;
    private final EmailUtil emailUtil;

    public SignInResponseDTO signIn(SignInRequestDTO req) {
        if (!userRepository.existsByEmailAndIsActiveTrue(req.getEmail())) {
            throw new RuntimeException("Tài khoản không tồn tại");
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
    public String signUp(SignUpRequestDTO req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng!");
        }

        User newUser = User.builder()
                .email(req.getEmail())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .fullName(req.getFullName())
                .phoneNumber(req.getPhoneNumber())
                .role(req.getRole())
                .createdAt(LocalDateTime.now())
                .build();

        String randomCode = UUID.randomUUID().toString();
        newUser.setVerificationCode(randomCode);
        newUser.setIsActive(false);

        userRepository.save(newUser);

        emailUtil.sendSignUpConfirmation(
                newUser.getEmail(),
                newUser.getFullName(),
                newUser.getVerificationCode()
        );
        return "Vui lòng kiểm tra email để xác thực tài khoản!";
    }

    public String verifyAccount(String email, String code) {
        // 1. Tìm user theo email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại!"));

        // 2. Kiểm tra mã code có khớp không
        if (user.getVerificationCode() != null && user.getVerificationCode().equals(code)) {
            user.setIsActive(true);
            user.setVerificationCode(null);
            userRepository.save(user);

            if (user.getRole() == User.RoleStatus.PATIENT) {
                PatientProfile selfProfile = PatientProfile.builder()
                    .fullName(user.getFullName())
                    .phoneNumber(user.getPhoneNumber())
                    .relationship("SELF") // Đánh dấu đây là hồ sơ chính bản thân mình
                    .user(user) // Liên kết với tài khoản vừa tạo
                    .build();
                patientProfileRepository.save(selfProfile);
            }

            return "Xác thực tài khoản thành công! Bây giờ bạn có thể đăng nhập.";
        } else {
            throw new RuntimeException("Đường link xác thực không hợp lệ hoặc đã hết hạn!");
        }
    }
}