package docbooking.admin.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReviewAdminResponse {
    private Integer reviewId;
    private String patientName;
    private String doctorName;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
    private Boolean isVisible;
    private Map<String, Double> aiLabels;
}
