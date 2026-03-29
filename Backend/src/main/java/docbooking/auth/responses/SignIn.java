package docbooking.auth.responses;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignIn {
    private String token;
    private String message = "Đăng nhập thành công !";

    public SignIn(String token) {
        this.token = token;
    }
}