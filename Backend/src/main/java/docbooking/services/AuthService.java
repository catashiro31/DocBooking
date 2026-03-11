package docbooking.services;

import docbooking.dtos.SignInRequestDTO;
import docbooking.dtos.SignUpRequestDTO;
import docbooking.models.User;
import docbooking.repositories.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    // Đăng ký
    public User signUp(SignUpRequestDTO req) {
        // Chặn ngay lập tức nếu ai đó cố tình hack để tạo tài khoản Admin
        if (req.getRole() == User.RoleStatus.ADMIN) {
            throw new IllegalArgumentException("Hành vi bị từ chối: Không được phép tạo tài khoản Quản trị viên!");
        }

        // Kiểm tra xem sổ đăng ký có ai dùng email này chưa
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email này đã được sử dụng!");
        }

        // Đưa mật khẩu vào máy băm nát ra (Mã hóa)
        String encodedPassword = passwordEncoder.encode(req.getPassword());

        // Ghi hồ sơ khách hàng mới
        User newUser = User.builder()
                .email(req.getEmail())
                .passwordHash(encodedPassword)
                .fullName(req.getFullName())
                .role(req.getRole())
                .isActive(true) // CHÚ Ý: Tài khoản đang bị khóa, chờ xác thực Email
                .build();

        // TODO: Gọi Bác đưa thư (emailService) đi gửi mã xác nhận ở đây

        return userRepository.save(newUser);
    }

    // Đăng nhập
    public User signIn(SignInRequestDTO req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        req.getEmail(),
                        req.getPassword()
                )
        );

        // Trả về thông tin người dùng
        return userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ người dùng!"));
    }
}