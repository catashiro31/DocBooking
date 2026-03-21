package docbooking.repositories;

import docbooking.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    @Query("SELECT u FROM User u")
    List<User> getAllUsers();

    // Cần khi đăng nhập (Đối chiếu với mật khẩu)
    Optional<User> findByEmail(String email);

    // Kiểm tra tài khoản có tồn tại không (Chuyển đến mục đăng kí)
    boolean existsByEmail(String email);

    User findByUserId(long userId);
}