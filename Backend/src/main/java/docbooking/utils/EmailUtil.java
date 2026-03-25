package docbooking.utils;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailUtil {

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

    public void sendDoctorApprovedEmail(String toEmail, String fullName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(senderEmail); // Email gửi đi
            message.setTo(toEmail);
            message.setSubject("[DocBooking] Thông báo: Hồ sơ bác sĩ đã được phê duyệt");

            String content = String.format(
                    "Xin chào Bác sĩ %s,\n\n" +
                            "Chúc mừng bác sĩ! Hồ sơ đăng ký chuyên môn của bác sĩ trên hệ thống DocBooking đã được phê duyệt thành công.\n\n" +
                            "Bây giờ bác sĩ có thể đăng nhập vào hệ thống để bắt đầu thiết lập lịch khám và tiếp nhận bệnh nhân.\n\n" +
                            "Các tính năng hiện đã mở cho bác sĩ:\n" +
                            "- Quản lý lịch khám (Time Slots)\n" +
                            "- Quản lý danh sách bệnh nhân đặt lịch\n" +
                            "- Cập nhật hồ sơ bệnh án điện tử\n\n" +
                            "Trân trọng,\n" +
                            "Đội ngũ quản trị DocBooking.",
                    fullName
            );

            message.setText(content);
            mailSender.send(message);
            System.out.println("Đã gửi email phê duyệt hồ sơ bác sĩ: " + toEmail);

        } catch (Exception e) {
            System.err.println("Lỗi gửi email: " + e.getMessage());
        }
    }

    public void sendDoctorRejectedEmail(String toEmail, String fullName, String reason) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(senderEmail);
            message.setTo(toEmail);
            message.setSubject("[DocBooking] Thông báo: Hồ sơ bác sĩ chưa được phê duyệt");

            String content = String.format(
                    "Xin chào Bác sĩ %s,\n\n" +
                            "Cảm ơn bác sĩ đã quan tâm và gửi hồ sơ đăng ký chuyên môn tại hệ thống DocBooking.\n\n" +
                            "Sau khi xem xét kỹ lưỡng, chúng tôi rất tiếc phải thông báo rằng hồ sơ của bác sĩ hiện chưa thể được phê duyệt.\n\n" +
                            "LÝ DO CỤ THỂ:\n" +
                            "----------------------------\n" +
                            "%s\n" +
                            "----------------------------\n\n" +
                            "Bác sĩ vui lòng đăng nhập lại hệ thống để cập nhật/chỉnh sửa hồ sơ theo lý do nêu trên và gửi lại yêu cầu phê duyệt.\n\n" +
                            "Trân trọng,\n" +
                            "Ban quản trị DocBooking.",
                    fullName,
                    (reason != null && !reason.isEmpty()) ? reason : "Thông tin hồ sơ chưa đầy đủ hoặc không chính xác."
            );

            message.setText(content);
            mailSender.send(message);
            System.out.println("Đã gửi email từ chối tới: " + toEmail);

        } catch (Exception e) {
            System.err.println("Lỗi gửi email từ chối: " + e.getMessage());
        }
    }

    public void sendAppointmentInformation(String toEmail, String fullName, String doctorName, String appointmentTime, String location) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(senderEmail);
            message.setTo(toEmail);
            message.setSubject("[DocBooking] Xác nhận: Lịch hẹn của bạn đã được phê duyệt");

            // Nội dung Email trình bày sạch sẽ
            String body = "Xin chào " + fullName + ",\n\n"
                    + "Chúng tôi vui mừng thông báo rằng lịch hẹn khám bệnh của bạn đã được phê duyệt thành công.\n\n"
                    + "--- THÔNG TIN CHI TIẾT LỊCH HẸN ---\n"
                    + "👨‍⚕️ Bác sĩ phụ trách: " + doctorName + "\n"
                    + "⏰ Thời gian: " + appointmentTime + "\n"
                    + "📍 Địa điểm: " + location + "\n"
                    + "-----------------------------------\n\n"
                    + "Lưu ý:\n"
                    + "- Vui lòng có mặt trước giờ hẹn 15 phút để làm thủ tục.\n"
                    + "- Nếu bạn muốn thay đổi hoặc hủy lịch, vui lòng thực hiện trên ứng dụng trước 24 giờ.\n\n"
                    + "Cảm ơn bạn đã tin tưởng sử dụng hệ thống DocBooking!\n\n"
                    + "Trân trọng,\n"
                    + "Đội ngũ hỗ trợ DocBooking.";

            message.setText(body);
            mailSender.send(message);
            System.out.println("Đã gửi email thông báo phê duyệt tới: " + toEmail);

        } catch (Exception e) {
            System.err.println("Lỗi khi gửi email phê duyệt: " + e.getMessage());
        }
    }

    public void sendPermanentBanEmail(String toEmail, String fullName, String reason) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(senderEmail);
            message.setTo(toEmail);
            message.setSubject("[DocBooking] Thông báo: Khóa tài khoản vĩnh viễn");

            String content = String.format(
                    "Xin chào %s,\n\n" +
                            "Chúng tôi rất tiếc phải thông báo rằng tài khoản của bạn trên hệ thống DocBooking đã bị KHÓA VĨNH VIỄN, có hiệu lực ngay lập tức.\n\n" +
                            "LÝ DO VI PHẠM:\n" +
                            "----------------------------\n" +
                            "%s\n" +
                            "----------------------------\n\n" +
                            "Quyết định này được đưa ra sau khi chúng tôi xem xét kỹ lưỡng các hoạt động trên tài khoản của bạn. Việc khóa vĩnh viễn đồng nghĩa với việc:\n" +
                            "- Bạn không thể đăng nhập vào hệ thống.\n" +
                            "- Mọi lịch hẹn hiện có (nếu có) sẽ bị hủy bỏ.\n" +
                            "- Bạn không được phép đăng ký tài khoản mới bằng thông tin này.\n\n" +
                            "Nếu bạn cho rằng đây là một sự nhầm lẫn, vui lòng liên hệ với bộ phận hỗ trợ qua email: support@docbooking.com.\n\n" +
                            "Trân trọng,\n" +
                            "Ban quản trị hệ thống DocBooking.",
                    fullName,
                    (reason != null && !reason.isEmpty()) ? reason : "Vi phạm nghiêm trọng điều khoản sử dụng của hệ thống."
            );

            message.setText(content);
            mailSender.send(message);
            System.out.println("Đã gửi email khóa tài khoản tới: " + toEmail);

        } catch (Exception e) {
            System.err.println("Lỗi gửi email khóa tài khoản: " + e.getMessage());
        }
    }
}