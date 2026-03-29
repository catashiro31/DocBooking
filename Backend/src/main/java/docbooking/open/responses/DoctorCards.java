package docbooking.open.responses;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorCards {
    private Integer doctorId;
    private String doctorName;
    private String specialtyName;
    private String doctorEmail;
    private String doctorPhone;
    private String avatarUrl;
}

