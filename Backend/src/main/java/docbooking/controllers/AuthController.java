package docbooking.controllers;

import docbooking.dtos.SignInRequestDTO;
import docbooking.dtos.SignInResponseDTO;
import docbooking.dtos.SignUpRequestDTO;
import docbooking.models.User;
import docbooking.security.JwtUtils;
import docbooking.services.AuthService;
import docbooking.services.RedisTokenService;
import docbooking.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final JwtUtils jwtUtils;
    private final AuthService authService;
    private final RedisTokenService redisTokenService;

    public  AuthController(JwtUtils jwtUtils, AuthService authService, RedisTokenService redisTokenService) {
        this.jwtUtils = jwtUtils;
        this.authService = authService;
        this.redisTokenService = redisTokenService;
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

    @PostMapping("/signout")
    public ResponseEntity<?> signOut(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            // Đảm bảo tên hàm trong jwtUtils phải khớp (getRemainingTime hoặc getRemainingExpiration)
            long remainingTime = jwtUtils.getRemainingExpiration(token);
            redisTokenService.blackListToken(token, remainingTime);

            // Trả về một Map để có định dạng JSON { "message": "..." }
            return ResponseEntity.ok(Map.of("message", "Đăng xuất thành công"));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "Token không khả dụng"));
    }
}
