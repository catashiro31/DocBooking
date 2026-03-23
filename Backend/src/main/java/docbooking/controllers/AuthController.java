package docbooking.controllers;

import docbooking.dtos.requests.SignInRequestDTO;
import docbooking.dtos.responses.SignInResponseDTO;
import docbooking.dtos.requests.SignUpRequestDTO;
import docbooking.models.User;
import docbooking.security.JwtTokenProvider;
import docbooking.services.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthService authService;

    public AuthController(
            AuthenticationManager authenticationManager,
            JwtTokenProvider jwtTokenProvider,
            AuthService authService
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.authService = authService;
    }

    @PostMapping("/signin")
    public ResponseEntity<?> SignIn(@RequestBody SignInRequestDTO  signInDTO) {
        try {
            SignInResponseDTO response = authService.signIn(signInDTO);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Tài khoản hông tồn tại")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> SignUp(
            @RequestBody SignUpRequestDTO signUpDTO
    ) {
        User user = authService.signUp(signUpDTO);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/signout")
    public ResponseEntity<?> SignOut() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok("Đăng xuất thành công!");
    }
}