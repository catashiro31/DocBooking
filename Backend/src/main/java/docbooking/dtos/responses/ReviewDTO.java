package docbooking.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReviewDTO {
    private Integer reviewId;
    private Integer rating;
    private String comment;
    private String patientName;
    private LocalDateTime createdAt;
}