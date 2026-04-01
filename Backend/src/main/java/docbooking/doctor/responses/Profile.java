package docbooking.doctor.responses;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Profile {
    private String fullName;
    private String email;
    private String phoneNumber;
    private String avatarUrl;

    private String bio;
    private String degree;
    private Integer experienceYears;
    private Double price;
    private Integer specialtyId;
    private String specialtyName;
    private Integer facilityId;
    private String facilityName;
    private String facilityAddress;
    private String facilityDescription;
    private String facilityMapUrl;
    private Boolean facilityVerified;
    private Double ratingAverage;
    private Integer reviewCount;
    private String verificationStatus;
}
