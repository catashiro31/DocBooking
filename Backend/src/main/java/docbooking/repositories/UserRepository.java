package docbooking.repositories;

import docbooking.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    // Cần khi đăng nhập (Đối chiếu với mật khẩu)
    Optional<User> findByEmail(String email);

    // Kiểm tra tài khoản có tồn tại không (Chuyển đến mục đăng kí)
    boolean existsByEmail(String email);

    User findByUserId(Integer userId);

    boolean existsByEmailAndIsActiveTrue(String email);

    long countByRoleAndCreatedAtBetween(User.RoleStatus role, LocalDateTime start, LocalDateTime end);

    long countByRole(User.RoleStatus role);
}