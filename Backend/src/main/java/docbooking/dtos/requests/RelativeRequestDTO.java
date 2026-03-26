package docbooking.dtos.requests;

import docbooking.models.PatientProfile;
import lombok.*;
import org.hibernate.property.access.internal.PropertyAccessStrategyNoopImpl;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RelativeRequestDTO {
    private String fullName;
    private LocalDate dateOfBirth;
    private PatientProfile.GenderStatus gender;
    private String phoneNumber;
    private String address;
    private String relationship;
}
