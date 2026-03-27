package docbooking.doctor.requests;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Profile {
    @NotBlank(message = "Tiểu sử không được để trống")
    private String bio;

    @NotBlank(message = "Vui lòng nhập bằng cấp (ví dụ: Thạc sĩ, Bác sĩ CKI...)")
    private String degree;

    @NotNull(message = "Vui lòng nhập số năm kinh nghiệm")
    @Min(value = 0, message = "Kinh nghiệm không được là số âm")
    private Integer experienceYears;

    @NotNull(message = "Vui lòng nhập giá khám")
    private Double price;

    @NotNull(message = "Vui lòng tải lên ảnh CCCD")
    private MultipartFile idCardImage;

    @NotNull(message = "Vui lòng đính kèm file chứng chỉ!")
    private MultipartFile certificatePdf;

    @NotNull(message = "Vui lòng chọn chuyên khoa")
    private Integer specialtyId;

    @NotNull(message = "Vui lòng chọn cơ sở y tế")
    private Integer facilityId;
}
