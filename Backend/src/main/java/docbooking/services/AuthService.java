package docbooking.services;

import docbooking.dtos.requests.SignInRequestDTO;
import docbooking.dtos.requests.SignUpRequestDTO;
import docbooking.dtos.responses.SignInResponseDTO;
import docbooking.models.User;
import docbooking.repositories.UserRepository;
import docbooking.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
    }
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
    public User signUp(SignUpRequestDTO req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng!");
        }

        // 2. Tạo User mới
        User newUser = new User();
        newUser.setFullName(req.getFullName());
        newUser.setEmail(req.getEmail());

        newUser.setPasswordHash(passwordEncoder.encode(req.getPassword()));

        newUser.setRole(req.getRole());
        return userRepository.save(newUser);
    }
}