package docbooking.user;
import docbooking.auth.requests.ChangePassword;
import docbooking.models.User;
import docbooking.user.requests.UpdateProfile;
import docbooking.user.responses.Profile;
import docbooking.utils.Security;
import jakarta.validation.Valid;
import lombok.Builder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Builder
@RestController
@RequestMapping("/api/v1/user")
public class UserController {
    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<?> profile(){
        User currentUser = Security.getCurrentUser();
        return ResponseEntity.ok(userService.getProfile(currentUser));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@Valid @ModelAttribute UpdateProfile req) {
        User currentUser = Security.getCurrentUser();
        Profile updatedProfile = userService.updateProfile(currentUser, req);
        return ResponseEntity.ok(updatedProfile);
    }

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePassword req) {
        User currentUser = Security.getCurrentUser();
        userService.changePassword(currentUser, req);
        return ResponseEntity.ok("Đổi mật khẩu thành công!");
    }

}
