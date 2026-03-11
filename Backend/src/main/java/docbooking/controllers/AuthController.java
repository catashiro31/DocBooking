package docbooking.controllers;

import docbooking.dtos.SignInRequestDTO;
import docbooking.dtos.SignInResponseDTO;
import docbooking.dtos.SignUpRequestDTO;
import docbooking.models.User;
import docbooking.security.JwtUtils;
import docbooking.services.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final JwtUtils jwtUtils;
    private final AuthService authService;

    public  AuthController(JwtUtils jwtUtils, AuthService authService) {
        this.jwtUtils = jwtUtils;
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<User> signUp(@RequestBody SignUpRequestDTO req) {
        User signUpUser = authService.signUp(req);
        return ResponseEntity.ok(signUpUser);
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signIn(@RequestBody SignInRequestDTO req) {
        try {
            // 1. Kiểm tra thông tin đăng nhập
            User signInUser = authService.signIn(req);

            // 2. Sinh token
            String jwtToken = jwtUtils.generateToken(signInUser);

            // 3. Đóng gói Thẻ và Lời nhắn báo thành công
            SignInResponseDTO responseDTO = new SignInResponseDTO(
                    jwtToken,
                    jwtUtils.getJwtExpiration(),
                    "Đăng nhập thành công! Chào mừng bạn quay lại."
            );
            return ResponseEntity.ok(responseDTO);

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Sai email hoặc mật khẩu. Vui lòng thử lại!");

        } catch (DisabledException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email để xác thực!");

        } catch (LockedException e) {
            return ResponseEntity.status(HttpStatus.LOCKED).body("Tài khoản của bạn đã bị khóa, không thể đăng nhập!");
        } catch (Exception e) {
            e.printStackTrace();
            // Các lỗi khác
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Đăng nhập thất bại: Lỗi hệ thống!");
        }
    }
}
