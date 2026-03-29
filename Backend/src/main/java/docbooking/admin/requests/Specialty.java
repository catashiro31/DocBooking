package docbooking.admin.requests;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Specialty {
    @NotBlank(message = "Tên chuyên khoa không được để trống!")
    private String specialtyName;
    private String description;
}