package docbooking.open.responses;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Facilities {
    private Integer id;
    private String name;
    private String address;
    private String description;
    private String imageUrl;
    private String licenseUrl;
    private String mapUrl;
    /** true = đã xác minh (admin hoặc bác sĩ tự xác nhận theo chính sách hệ thống) */
    private Boolean verified;
}
