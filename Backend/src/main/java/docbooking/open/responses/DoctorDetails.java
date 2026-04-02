package docbooking.open.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DoctorDetails {
    private Integer id;
    private String fullName;
    private String specialtyName;
    private Integer specialtyId;
    private String degree;
    private Integer experienceYears;
    private Double price;
    private String bio;
    private String facilityName;
    private String facilityAddress;
    private String facilityMapUrl;
    private Boolean facilityVerified;
    private String doctorEmail;
    private String doctorPhone;
    private String avatarUrl;
    private Double ratingAverage;
    private Integer totalReviews;
}
