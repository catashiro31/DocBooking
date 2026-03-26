package docbooking.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor // BẮT BUỘC phải có Constructor đầy đủ tham số
public class AppointmentStats {
    private long completed;
    private long pending;
    private long cancelled;
}