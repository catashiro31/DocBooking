package docbooking.patient.requests;

import docbooking.models.PatientProfile;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Relative {
    private String fullName;
    private LocalDate dateOfBirth;
    private PatientProfile.GenderStatus gender;
    private String phoneNumber;
    private String address;
    private String relationship;
}
