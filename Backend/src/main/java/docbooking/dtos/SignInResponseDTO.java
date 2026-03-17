package docbooking.dtos;

import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;

@Getter
@Setter
public class SignInResponseDTO {
    private String token;
    private String message = "Đăng nhập thành công !";
    private long jwtExpiration;

    public SignInResponseDTO(String token, long jwtExpiration) {
        this.token = token;
        this.jwtExpiration = jwtExpiration;
    }
}