package docbooking.controllers;

import docbooking.dtos.SignUpRequestDTO;
import docbooking.models.User;
import docbooking.services.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signUp(@RequestBody SignUpRequestDTO user) {
        ResponseEntity<String> response = null;

        try {
            User newUser = authService.createUser(user);
            if (newUser.getUserId() > 0) {
                response = ResponseEntity.status(HttpStatus.CREATED)
                        .body("User has been created successfully for user = " + newUser.getFullName());
            }
        } catch (Exception e) {
            response = ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An exception occurred from server with exception = " + e);
        }

        return response;
    }
}
