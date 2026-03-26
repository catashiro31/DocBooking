package docbooking.dtos.responses;

import lombok.Getter;
import lombok.Setter;

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