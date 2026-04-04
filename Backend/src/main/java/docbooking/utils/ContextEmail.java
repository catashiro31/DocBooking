package docbooking.utils;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class ContextEmail {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    /**
     * Helper to wrap content in a professional HTML container
     */
    private String getHtmlContainer(String title, String content) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<style>" +
                "  body { font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }" +
                "  .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #eef2ff; }" +
                "  .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 32px; text-align: center; }" +
                "  .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.02em; }" +
                "  .content { padding: 40px; color: #334155; line-height: 1.6; font-size: 16px; }" +
                "  .footer { background-color: #f1f5f9; padding: 24px; text-align: center; font-size: 13px; color: #64748b; }" +
                "  .button { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #ffffff !important; text-decoration: none; border-radius: 12px; font-weight: 700; margin-top: 24px; box-shadow: 0 8px 20px rgba(99,102,241,0.25); }" +
                "  .info-box { background-color: #f8fafc; border: 1px solid #eef2ff; border-radius: 12px; padding: 20px; margin-top: 24px; }" +
                "  .info-item { margin-bottom: 8px; font-size: 14px; }" +
                "  .info-label { font-weight: 700; color: #4338ca; width: 120px; display: inline-block; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "  <div class='container'>" +
                "    <div class='header'>" +
                "      <h1>DocBooking</h1>" +
                "    </div>" +
                "    <div class='content'>" +
                "      <h2 style='color: #0f172a; margin-top: 0;'>" + title + "</h2>" +
                "      " + content + "" +
                "    </div>" +
                "    <div class='footer'>" +
                "      &copy; 2024 DocBooking. Chăm sóc sức khỏe thông minh.<br/>" +
                "      Địa chỉ: Khu Công Nghệ Cao, Quận 9, TP. HCM<br/>" +
                "      Hỗ trợ: support@docbooking.com" +
                "    </div>" +
                "  </div>" +
                "</body>" +
                "</html>";
    }

    private void sendHtmlEmail(String toEmail, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, 
                MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, 
                StandardCharsets.UTF_8.name());

            helper.setFrom(senderEmail);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            System.out.println("Email HTML đã được gửi thành công tới: " + toEmail);
        } catch (MessagingException e) {
            System.err.println("Lỗi khi tạo email HTML: " + e.getMessage());
        }
    }

    public void sendSignUpConfirmation(String toEmail, String fullName, String verificationCode) {
        String frontendUrl = "http://103.69.97.14/verify-account"; 
        String verifyLink = frontendUrl + "?email=" + toEmail + "&code=" + verificationCode;

        String content = "<p>Xin chào <strong>" + fullName + "</strong>,</p>" +
                "<p>Cảm ơn bạn đã đăng ký tài khoản tại <strong>DocBooking</strong> - Nền tảng đặt lịch khám bệnh thông minh.</p>" +
                "<p>Vui lòng click vào nút bên dưới để kích hoạt tài khoản của bạn và bắt đầu trải nghiệm dịch vụ:</p>" +
                "<div style='text-align: center;'>" +
                "  <a href='" + verifyLink + "' class='button'>Kích hoạt tài khoản</a>" +
                "</div>" +
                "<p style='font-size: 14px; color: #94a3b8; margin-top: 24px;'>Lưu ý: Đường link này chỉ có hiệu lực trong vòng 24 giờ. Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>";

        sendHtmlEmail(toEmail, "[DocBooking] Xác thực tài khoản của bạn", getHtmlContainer("Chào mừng bạn đến với DocBooking!", content));
    }

    public void sendDoctorApprovedEmail(String toEmail, String fullName) {
        String content = "<p>Xin chào Bác sĩ <strong>" + fullName + "</strong>,</p>" +
                "<p>Chúc mừng bác sĩ! Hồ sơ đăng ký chuyên môn của bác sĩ trên hệ thống <strong>DocBooking</strong> đã được phê duyệt thành công.</p>" +
                "<p>Bây giờ bác sĩ có thể đăng nhập vào hệ thống để bắt đầu thiết lập lịch khám và tiếp nhận bệnh nhân.</p>" +
                "<div class='info-box'>" +
                "  <div class='info-item'><span class='info-label'>Quản lý:</span> Lịch khám (Time Slots)</div>" +
                "  <div class='info-item'><span class='info-label'>Tiếp nhận:</span> Danh sách bệnh nhân</div>" +
                "  <div class='info-item'><span class='info-label'>Bệnh án:</span> Hồ sơ điện tử</div>" +
                "</div>" +
                "  <a href='http://103.69.97.14/signin' class='button'>Đăng nhập ngay</a>" +
                "</div>";

        sendHtmlEmail(toEmail, "[DocBooking] Thông báo: Hồ sơ bác sĩ đã được phê duyệt", getHtmlContainer("Hồ sơ đã được phê duyệt!", content));
    }

    public void sendDoctorRejectedEmail(String toEmail, String fullName, String reason) {
        String content = "<p>Xin chào Bác sĩ <strong>" + fullName + "</strong>,</p>" +
                "<p>Cảm ơn bác sĩ đã quan tâm đến hệ thống <strong>DocBooking</strong>.</p>" +
                "<p>Sau khi xem xét kỹ lưỡng, chúng tôi rất tiếc phải thông báo rằng hồ sơ của bác sĩ hiện chưa thể được phê duyệt.</p>" +
                "<div class='info-box' style='border-left: 4px solid #ef4444;'>" +
                "  <strong style='color: #ef4444; display: block; margin-bottom: 8px;'>LÝ DO CỤ THỂ:</strong>" +
                "  <p style='margin: 0; font-style: italic;'>" + (reason != null && !reason.isEmpty() ? reason : "Thông tin hồ sơ chưa đầy đủ hoặc không chính xác.") + "</p>" +
                "</div>" +
                "<p>Bác sĩ vui lòng đăng nhập lại hệ thống để cập nhật hồ sơ và gửi lại yêu cầu phê duyệt.</p>" +
                "<div style='text-align: center;'>" +
                "  <a href='http://103.69.97.14/signin' class='button'>Cập nhật hồ sơ</a>" +
                "</div>";

        sendHtmlEmail(toEmail, "[DocBooking] Thông báo: Hồ sơ bác sĩ chưa được phê duyệt", getHtmlContainer("Thông báo về hồ sơ bác sĩ", content));
    }

    public void sendAppointmentInformation(String toEmail, String fullName, String doctorName, String appointmentTime, String location) {
        String content = "<p>Xin chào <strong>" + fullName + "</strong>,</p>" +
                "<p>Chúng tôi vui mừng thông báo rằng lịch hẹn khám bệnh của bạn đã được phê duyệt thành công.</p>" +
                "<div class='info-box'>" +
                "  <div class='info-item'><span class='info-label'>👨‍⚕️ Bác sĩ:</span> " + doctorName + "</div>" +
                "  <div class='info-item'><span class='info-label'>⏰ Thời gian:</span> " + appointmentTime + "</div>" +
                "  <div class='info-item'><span class='info-label'>📍 Địa điểm:</span> " + location + "</div>" +
                "</div>" +
                "<p style='font-size: 14px; margin-top: 20px;'><strong>Lưu ý:</strong> Vui lòng có mặt trước giờ hẹn 15 phút để làm thủ tục. Bạn có thể quản lý lịch hẹn trong ứng dụng của mình.</p>" +
                "<div style='text-align: center;'>" +
                "  <a href='http://103.69.97.14/patient/appointments' class='button'>Xem chi tiết lịch hẹn</a>" +
                "</div>";

        sendHtmlEmail(toEmail, "[DocBooking] Xác nhận: Lịch hẹn của bạn đã được phê duyệt", getHtmlContainer("Xác nhận lịch hẹn thành công!", content));
    }

    public void sendPermanentBanEmail(String toEmail, String fullName, String reason) {
        String content = "<p>Xin chào <strong>" + fullName + "</strong>,</p>" +
                "<p>Chúng tôi rất tiếc phải thông báo rằng tài khoản của bạn trên hệ thống <strong>DocBooking</strong> đã bị <strong>KHÓA VĨNH VIỄN</strong>, có hiệu lực ngay lập tức.</p>" +
                "<div class='info-box' style='border-left: 4px solid #ef4444;'>" +
                "  <strong style='color: #ef4444; display: block; margin-bottom: 8px;'>LÝ DO VI PHẠM:</strong>" +
                "  <p style='margin: 0; font-style: italic;'>" + (reason != null && !reason.isEmpty() ? reason : "Vi phạm nghiêm trọng điều khoản sử dụng của hệ thống.") + "</p>" +
                "</div>" +
                "<p>Quyết định này là cuối cùng. Mọi lịch hẹn hiện có sẽ bị hủy bỏ.</p>" +
                "<p>Nếu bạn cho rằng đây là một sự nhầm lẫn, vui lòng liên hệ bộ phận hỗ trợ qua email.</p>";

        sendHtmlEmail(toEmail, "[DocBooking] Thông báo: Khóa tài khoản vĩnh viễn", getHtmlContainer("Thông báo khóa tài khoản", content));
    }

    public void sendBookingSuccessNotification(String patientEmail, String patientName, String doctorEmail, String doctorName, String appointmentTime, String location) {
        try {
            // 1. Gửi cho Bệnh nhân
            SimpleMailMessage patientMessage = new SimpleMailMessage();
            patientMessage.setFrom(senderEmail);
            patientMessage.setTo(patientEmail);
            patientMessage.setSubject("[DocBooking] Xác nhận: Bạn đã đặt lịch hẹn thành công");

            String patientBody = String.format(
                "Xin chào %s,\n\n"
                + "Bạn đã đặt lịch hẹn thành công trên hệ thống DocBooking. Hiện tại lịch hẹn của bạn đang chờ bác sĩ xác nhận.\n\n"
                + "--- THÔNG TIN LỊCH HẸN ---\n"
                + "👨‍⚕️ Bác sĩ: %s\n"
                + "⏰ Thời gian: %s\n"
                + "📍 Địa điểm: %s\n"
                + "---------------------------\n\n"
                + "Chúng tôi sẽ thông báo cho bạn ngay khi bác sĩ phê duyệt lịch hẹn này.\n\n"
                + "Trân trọng,\n"
                + "Đội ngũ DocBooking!",
                patientName, doctorName, appointmentTime, location
            );
            patientMessage.setText(patientBody);
            mailSender.send(patientMessage);

            // 2. Gửi cho Bác sĩ
            SimpleMailMessage doctorMessage = new SimpleMailMessage();
            doctorMessage.setFrom(senderEmail);
            doctorMessage.setTo(doctorEmail);
            doctorMessage.setSubject("[DocBooking] Thông báo: Có lịch hẹn mới đang chờ xác nhận");

            String doctorBody = String.format(
                "Xin chào Bác sĩ %s,\n\n"
                + "Hệ thống DocBooking ghi nhận một yêu cầu đặt lịch mới từ bệnh nhân.\n\n"
                + "--- THÔNG TIN YÊU CẦU ---\n"
                + "👤 Bệnh nhân: %s\n"
                + "⏰ Thời gian: %s\n"
                + "-------------------------\n\n"
                + "Vui lòng đăng nhập vào hệ thống để xem chi tiết và xác nhận lịch hẹn này.\n\n"
                + "Trân trọng,\n"
                + "Hệ thống DocBooking!",
                doctorName, patientName, appointmentTime
            );
            doctorMessage.setText(doctorBody);
            mailSender.send(doctorMessage);

            System.out.println("Đã gửi email thông báo đặt lịch tới bệnh nhân và bác sĩ thành công.");

        } catch (Exception e) {
            System.err.println("Lỗi khi gửi email thông báo đặt lịch: " + e.getMessage());
        }
    }

    public void sendPasswordResetEmail(String toEmail, String fullName, String newPassword) {
        String content = "<p>Xin chào <strong>" + fullName + "</strong>,</p>" +
                "<p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản <strong>DocBooking</strong>.</p>" +
                "<p>Dưới đây là mật khẩu tạm thời của bạn:</p>" +
                "<div style='text-align: center; margin: 32px 0;'>" +
                "  <div style='display: inline-block; padding: 16px 40px; background-color: #f1f5f9; border: 2px dashed #6366f1; border-radius: 12px; font-size: 24px; font-weight: 800; color: #4338ca; letter-spacing: 2px;'>" +
                "    " + newPassword + " " +
                "  </div>" +
                "</div>" +
                "<p>Vui lòng đăng nhập và <strong>đổi mật khẩu ngay</strong> để đảm bảo an toàn cho tài khoản của bạn.</p>" +
                "<div style='text-align: center;'>" +
                "  <a href='http://103.69.97.14/signin' class='button'>Đăng nhập và Đổi mật khẩu</a>" +
                "</div>";

        sendHtmlEmail(toEmail, "[DocBooking] Mật khẩu mới của bạn", getHtmlContainer("Khôi phục mật khẩu", content));
    }
}