package docbooking.controllers;



import docbooking.dtos.requests.ChangePasswordRequestDTO;
import docbooking.dtos.requests.UpdateProfileRequestDTO;
import docbooking.dtos.responses.ProfileResponseDTO;
import docbooking.models.User;
import docbooking.security.SecurityUtils;
import docbooking.services.UserService;
import lombok.Builder;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@Builder
@RestController
@RequestMapping("/api/v1/user")
public class UserController {
    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<?> profile(){
          User currentUser = SecurityUtils.getCurrentUser();
          if (currentUser==null) {
              return ResponseEntity.status(401).body("Bạn chưa đăng nhập!");
          }
          return ResponseEntity.ok(userService.getProfile(currentUser));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody UpdateProfileRequestDTO req) {
        User currentUser = SecurityUtils.getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(401).body("Bạn cần đăng nhập!");
        }

        ProfileResponseDTO updatedProfile = userService.updateProfile(currentUser, req);
        return ResponseEntity.ok(updatedProfile);
    }

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequestDTO req) {
        User currentUser = SecurityUtils.getCurrentUser();

        if (currentUser == null) {
            return ResponseEntity.status(401).body("Bạn cần đăng nhập!");
        }

        try {
            userService.changePassword(currentUser, req);
            return ResponseEntity.ok("Đổi mật khẩu thành công!");
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }


}
