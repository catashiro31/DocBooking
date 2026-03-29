package docbooking.security;

import docbooking.repositories.UserRepository;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@Configuration
public class CustomUserDetails implements UserDetailsService {

    private final UserRepository userRepository;
    public CustomUserDetails(UserRepository userRepo) {
        this.userRepository = userRepo;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        try {
            return userRepository.findByEmail(email)
                    .orElseThrow(() -> new Exception("Không tìm thấy người dùng!"));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public UserDetails loadUserById(Integer id) { // Đổi Integer thành Long nếu DB của bạn dùng Long
        // Giả sử tên hàm trong Repo của bạn là findById
        return userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng với ID: " + id));
    }
}
