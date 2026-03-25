package docbooking.dtos.responses;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorCardDTO {
    private String doctorName;
    private String specialtyName;
    private String doctorEmail;
    private String doctorPhone;
    private String avatarUrl;
}

