package docbooking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import jakarta.annotation.PostConstruct;
import java.util.TimeZone;

@SpringBootApplication
public class BackendApplication {

	@PostConstruct
	public void init() {
		// Cố định múi giờ hệ thống là giờ Việt Nam (UTC+7)
		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));

		// Lưu ý: Nếu server team bạn muốn dùng chuẩn quốc tế thì đổi thành:
		// TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
	}

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}