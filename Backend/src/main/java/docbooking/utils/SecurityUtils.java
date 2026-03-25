package docbooking.utils;

import docbooking.models.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtils {
    public static User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.getPrincipal() instanceof User) {
            return  (User) authentication.getPrincipal();
        }
        return null;
    }

    public static boolean hasRole(User.RoleStatus role) {
        User user = getCurrentUser();
        return user != null && user.getRole() == role;
    }
}
