package docbooking.repositories;

import docbooking.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    // Cần khi đăng nhập (Đối chiếu với mật khẩu)
    Optional<User> findByEmail(String email);

    // Kiểm tra tài khoản có tồn tại không (Chuyển đến mục đăng kí)
    boolean existsByEmail(String email);

    boolean existsByPhoneNumber(String phoneNumber);

    // Tìm danh sách theo vai trò (Lọc bác sĩ / bệnh nhân)
    List<User> findByRole(User.RoleStatus role);

    List<User> findByIsActive(boolean isActive);

}