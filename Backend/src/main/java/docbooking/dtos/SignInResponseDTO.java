package docbooking.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignInResponseDTO {
    private String token;
    private long expiresIn;
    private String message;

    public  SignInResponseDTO(String token, long expiresIn, String mes) {
        this.token = token;
        this.expiresIn = expiresIn;
        this.message = mes;
    }
}
