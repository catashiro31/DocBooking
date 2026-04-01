package docbooking.utils;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile; // Đã sửa lại import chuẩn xác

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Component // BẮT BUỘC CÓ: Để Spring Boot quản lý và cho phép tiêm (inject) ở nơi khác
public class ConvertUrl {

    private final Cloudinary cloudinary;

    // Cần có Constructor để Spring Boot tự động nạp cấu hình Cloudinary vào đây
    public ConvertUrl(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public void validateFile(MultipartFile file, String fieldName, String... supportedTypes) {
        if (file == null || file.isEmpty()) return;
        String contentType = file.getContentType();
        if (contentType == null || !isSupported(contentType, supportedTypes)) {
            throw new RuntimeException(fieldName + " chỉ hỗ trợ định dạng " + getSupportedTypesString(supportedTypes) + "!");
        }
    }

    private boolean isSupported(String contentType, String... supportedTypes) {
        for (String type : supportedTypes) {
            if (contentType.equals(type)) {
                return true;
            }
        }
        return false;
    }

    private String getSupportedTypesString(String... supportedTypes) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < supportedTypes.length; i++) {
            sb.append(getTypeDescription(supportedTypes[i]));
            if (i < supportedTypes.length - 1) {
                sb.append(", ");
            }
        }
        return sb.toString();
    }

    private String getTypeDescription(String type) {
        switch (type) {
            case "image/jpeg":
                return "JPG";
            case "image/png":
                return "PNG";
            case "application/pdf":
                return "PDF";
            default:
                return type;
        }
    }

    public String getUrlFile(MultipartFile file) { // Sửa thành MultipartFile
        if (file != null && !file.isEmpty()) {
            try {
                String publicValue = UUID.randomUUID().toString();

                Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                        ObjectUtils.asMap(
                                "public_id", publicValue,
                                "resource_type", "auto"
                        ));

                return uploadResult.get("secure_url").toString();

            } catch (IOException e) {
                throw new RuntimeException("Lỗi khi tải ảnh lên hệ thống: " + e.getMessage());
            }
        }

        // BẮT BUỘC CÓ: Trả về null nếu người dùng không gửi file nào lên
        return null;
    }
}