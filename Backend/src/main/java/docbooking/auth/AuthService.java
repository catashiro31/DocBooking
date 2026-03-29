package docbooking.auth;

import docbooking.auth.requests.SignIn;
import docbooking.auth.requests.SignUp;
import docbooking.models.PatientProfile;
import docbooking.models.User;
import docbooking.repositories.PatientProfileRepository;
import docbooking.repositories.UserRepository;
import docbooking.security.JwtTokenProvider;
import docbooking.utils.ContextEmail;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final PatientProfileRepository patientProfileRepository;
    private final ContextEmail contextEmail;

    public docbooking.auth.responses.SignIn signIn(SignIn req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại"));

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            // Phân biệt: chưa verify email vs bị khóa
            if (user.getVerificationCode() != null) {
                throw new RuntimeException("Tài khoản chưa được xác thực. Vui lòng kiểm tra email để xác thực!");
            }
            String reason = user.getReasonBanned() != null ? user.getReasonBanned() : "Vi phạm chính sách";
            throw new RuntimeException("Tài khoản đã bị khóa. Lý do: " + reason);
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
            );

            String jwt = jwtTokenProvider.createToken(authentication);
            return new docbooking.auth.responses.SignIn(jwt);

        } catch (BadCredentialsException e) {
            throw new RuntimeException("Sai mật khẩu");
        }
    }
    @Transactional
    public String signUp(SignUp req) {
        if (req.getRole() == User.RoleStatus.ADMIN) {
            throw new RuntimeException("Không thể đăng ký tài khoản với quyền quản trị!");
        }
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng!");
        }

        User newUser = User.builder()
                .email(req.getEmail())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .fullName(req.getFullName())
                .phoneNumber(req.getPhoneNumber())
                .role(req.getRole())
                .build();

        String randomCode = UUID.randomUUID().toString();
        newUser.setVerificationCode(randomCode);
        newUser.setCodeExpiry(LocalDateTime.now().plusHours(24));
        newUser.setIsActive(false);

        userRepository.save(newUser);

        contextEmail.sendSignUpConfirmation(
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

        // 2. Kiểm tra mã code có khớp và chưa hết hạn không
        if (user.getVerificationCode() == null || !user.getVerificationCode().equals(code)) {
            throw new RuntimeException("Đường link xác thực không hợp lệ!");
        }
        if (user.getCodeExpiry() == null || LocalDateTime.now().isAfter(user.getCodeExpiry())) {
            throw new RuntimeException("Đường link xác thực đã hết hạn! Vui lòng đăng ký lại.");
        }

        user.setIsActive(true);
        user.setVerificationCode(null);
        user.setCodeExpiry(null);
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
    }

    @Transactional
    public String forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email không tồn tại trong hệ thống!"));

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            if (user.getVerificationCode() != null) {
                throw new RuntimeException("Tài khoản chưa được xác thực. Vui lòng xác thực email trước!");
            }
            throw new RuntimeException("Tài khoản đã bị khóa. Không thể đặt lại mật khẩu!");
        }

        // Tạo mật khẩu random 8 ký tự (chữ + số)
        String newPassword = generateRandomPassword(8);

        // Cập nhật mật khẩu trong database
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Gửi email với mật khẩu mới
        contextEmail.sendPasswordResetEmail(user.getEmail(), user.getFullName(), newPassword);

        return "Mật khẩu mới đã được gửi đến email của bạn!";
    }

    private String generateRandomPassword(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder sb = new StringBuilder();
        java.util.Random random = new java.util.Random();
        for (int i = 0; i < length; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }
}