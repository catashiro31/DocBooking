package docbooking.services;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    public void sendSignUpConfirmation(String toEmail, String fullName, String verificationCode) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(senderEmail);
            message.setTo(toEmail);
            message.setSubject("[DocBooking] Xác thực tài khoản của bạn");

            // Tạo đường dẫn xác thực (Link này trỏ về API của bạn)
            // Lưu ý: Thay localhost:5020 bằng domain thật nếu bạn deploy lên server
            String verifyLink = "http://localhost:5020/api/v1/auth/verify?email=" + toEmail + "&code=" + verificationCode;

            // Nội dung Email có chứa link
            String body = "Xin chào " + fullName + ",\n\n"
                    + "Cảm ơn bạn đã đăng ký tài khoản tại DocBooking.\n"
                    + "Vui lòng click vào đường link dưới đây để kích hoạt tài khoản của bạn:\n\n"
                    + verifyLink + "\n\n"
                    + "Lưu ý: Đường link này chỉ có hiệu lực trong vòng 24 giờ.\n"
                    + "Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.\n\n"
                    + "Trân trọng,\n"
                    + "Đội ngũ DocBooking!";

            message.setText(body);
            mailSender.send(message);
            System.out.println("Đã gửi link xác thực thành công tới: " + toEmail);

        } catch (Exception e) {
            System.err.println("Lỗi gửi email: " + e.getMessage());
        }
    }
}