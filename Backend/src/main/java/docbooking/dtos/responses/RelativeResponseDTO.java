package docbooking.dtos.responses;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RelativeResponseDTO {
    private Integer patientId;
    private String fullName;
    private LocalDate dateOfBirth;
    private String gender;
    private String phoneNumber;
    private String address;
    private String relationship;
}
