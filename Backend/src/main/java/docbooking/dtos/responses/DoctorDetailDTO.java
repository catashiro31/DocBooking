package docbooking.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DoctorDetailDTO {
    private Integer id;
    private String fullName;
    private String specialtyName;
    private Double price;
    private String bio;
    private String doctorEmail;
    private String doctorPhone;
    private String avatarUrl;
    private Double ratingAverage;
    private Integer totalReviews;
}
