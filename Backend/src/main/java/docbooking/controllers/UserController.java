package docbooking.controllers;
import docbooking.dtos.requests.ChangePasswordRequestDTO;
import docbooking.dtos.requests.UpdateProfileRequestDTO;
import docbooking.dtos.responses.ProfileResponseDTO;
import docbooking.models.User;
import docbooking.security.SecurityUtils;
import docbooking.services.UserService;
import jakarta.validation.Valid;
import lombok.Builder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Builder
@RestController
@RequestMapping("/api/v1/user")
public class UserController {
    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<?> profile(){
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(userService.getProfile(currentUser));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@Valid @RequestBody UpdateProfileRequestDTO req) {
        User currentUser = SecurityUtils.getCurrentUser();
        ProfileResponseDTO updatedProfile = userService.updateProfile(currentUser, req);
        return ResponseEntity.ok(updatedProfile);
    }

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequestDTO req) {
        User currentUser = SecurityUtils.getCurrentUser();
        userService.changePassword(currentUser, req);
        return ResponseEntity.ok("Đổi mật khẩu thành công!");
    }

}
