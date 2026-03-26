package docbooking.dtos.requests;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicalResultRequestDTO {
    private String diagnosis;
    private String doctorNotes;
    private MultipartFile prescriptionFile;
}
