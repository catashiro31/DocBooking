package docbooking.auth;

import docbooking.auth.requests.SignIn;
import docbooking.auth.requests.SignUp;
import docbooking.models.TokenBlacklist;
import docbooking.repositories.TokenBlacklistRepository;
import docbooking.security.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthService authService;
    private final TokenBlacklistRepository tokenBlacklistRepository;

    public AuthController(
            AuthenticationManager authenticationManager,
            JwtTokenProvider jwtTokenProvider,
            AuthService authService,
            TokenBlacklistRepository tokenBlacklistRepository
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.authService = authService;
        this.tokenBlacklistRepository = tokenBlacklistRepository;
    }

    @PostMapping("/signin")
    public ResponseEntity<?> SignIn(@Valid @RequestBody SignIn signInDTO) {
        try {
            docbooking.auth.responses.SignIn response = authService.signIn(signInDTO);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("không tồn tại")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
            }
            if (e.getMessage().contains("đã bị khóa")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
            }
            if (e.getMessage().contains("chưa được xác thực")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> SignUp(
           @Valid @RequestBody SignUp signUpDTO
    ) {
        return ResponseEntity.ok(authService.signUp(signUpDTO));
    }

    @PostMapping("/signout")
    public ResponseEntity<?> SignOut(HttpServletRequest request) {
        String token = jwtTokenProvider.resolveToken(request);
        if (token != null && jwtTokenProvider.validateToken(token)) {
            TokenBlacklist blacklistedToken = TokenBlacklist.builder()
                    .token(token)
                    .expiryDate(jwtTokenProvider.getExpiryDateFromToken(token))
                    .build();
            tokenBlacklistRepository.save(blacklistedToken);
        }
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok("Đăng xuất thành công!");
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyAccount(@RequestParam String email, @RequestParam String code) {
        try {
            String result = authService.verifyAccount(email, code);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        try {
            String result = authService.forgotPassword(email);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}