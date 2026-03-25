package docbooking.dtos.responses;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorProfileResponseDTO {
    private String fullName;
    private String email;
    private String phoneNumber;
    private String avatarUrl;

    private String bio;
    private String degree;
    private Integer experienceYears;
    private Double price;
    private String specialtyName;
    private String facilityName;
    private String facilityAddress;
    private Double ratingAverage;
    private Integer reviewCount;
    private String verificationStatus;
}
