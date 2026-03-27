package docbooking.auth.responses;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignIn {
    private String token;
    private String message = "Đăng nhập thành công !";
    private long jwtExpiration;

    public SignIn(String token, long jwtExpiration) {
        this.token = token;
        this.jwtExpiration = jwtExpiration;
    }
}