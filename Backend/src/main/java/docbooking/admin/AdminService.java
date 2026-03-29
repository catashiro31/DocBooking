package docbooking.admin;

import docbooking.admin.requests.Facility;
import docbooking.admin.requests.Specialty;
import docbooking.admin.responses.AppointmentStats;
import docbooking.admin.responses.Stat;
import docbooking.models.*;
import docbooking.repositories.*;
import docbooking.utils.ContextEmail;
import docbooking.utils.ConvertUrl;
import org.springframework.transaction.annotation.Transactional;
import docbooking.admin.requests.ContactReply;

import java.time.LocalDateTime;
import java.util.List;

@org.springframework.stereotype.Service
public class AdminService {
    private final DoctorDetailRepository doctorDetail;
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final SpecialtyRepository specialtyRepository;
    private final FacilityRepository facilityRepository;
    private final ConvertUrl convertUrl;
    private final ContextEmail contextEmail;
    private final ReviewRepository reviewRepository;
    private final ContactRepository contactRepository;

    public AdminService(DoctorDetailRepository doctorDetail, PatientProfileRepository patientProfile, AppointmentRepository appointment, AppointmentRepository appointmentRepository, UserRepository userRepository, SpecialtyRepository specialtyRepository, FacilityRepository facilityRepository, ConvertUrl convertUrl, ContextEmail contextEmail, ReviewRepository reviewRepository, ContactRepository contactRepository) {
        this.doctorDetail = doctorDetail;
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
        this.specialtyRepository = specialtyRepository;
        this.facilityRepository = facilityRepository;
        this.convertUrl = convertUrl;
        this.contextEmail = contextEmail;
        this.reviewRepository = reviewRepository;
        this.contactRepository = contactRepository;
    }

    public Stat getStats(LocalDateTime start, LocalDateTime end) {
        // 1. Lấy dữ liệu gộp từ Repo (Chỉ 1 lần truy vấn DB)
        AppointmentStats appStats = appointmentRepository.getAppointmentStatsByPeriod(start, end);

        // 2. Xử lý nếu appStats bị null (để tránh lỗi .getCompleted() bị null)
        if (appStats == null) {
            appStats = new AppointmentStats(0, 0, 0);
        }

        // 3. Đóng gói vào kết quả trả về
        return Stat.builder()
                .numberOfDoctors(userRepository.countByRoleAndCreatedAtBetween(User.RoleStatus.DOCTOR, start, end))
                .numberOfPatients(userRepository.countByRoleAndCreatedAtBetween(User.RoleStatus.PATIENT, start, end))
                .numberOfSuccessAppointments(appStats.getCompleted())
                .numberOfPendingAppointments(appStats.getPending())
                .numberOfFailingAppointments(appStats.getCancelled())
                .build();
    }

    public List<DoctorDetail> getPendingDoctors() {
        return doctorDetail.findDoctorDetailByVerificationStatus(DoctorDetail.VerificationStatus.PENDING);
    }

    public DoctorDetail approveDoctor(Integer doctorId) {
        DoctorDetail doctor = doctorDetail.findByDoctorId(doctorId);
        if (doctor == null) {
            throw new RuntimeException("Không tìm thấy thông tin bác sĩ với ID: " + doctorId);
        }
        doctor.setVerificationStatus(DoctorDetail.VerificationStatus.APPROVED);
        String email = doctor.getUser().getEmail();
        String fullName = doctor.getUser().getFullName();
        contextEmail.sendDoctorApprovedEmail(email, fullName);
        return doctorDetail.save(doctor);
    }

    public DoctorDetail rejectDoctor(Integer doctorId, String reason) {
        DoctorDetail doctor = doctorDetail.findByDoctorId(doctorId);
        if (doctor == null) {
            throw new RuntimeException("Không tìm thấy thông tin bác sĩ với ID: " + doctorId);
        }
        doctor.setVerificationStatus(DoctorDetail.VerificationStatus.REJECTED);
        doctor.setReasonReject(reason);
        String email = doctor.getUser().getEmail();
        String fullName = doctor.getUser().getFullName();
        contextEmail.sendDoctorRejectedEmail(email, fullName, reason);
        doctorDetail.save(doctor);
        return doctor;
    }

    public List<User> getAllUsers() {
        return userRepository.getAllUsers();
    }

    @Transactional // Đảm bảo tính nhất quán dữ liệu
    public String setBlockedUser(Integer userId, String reason) {
        User user = userRepository.findByUserId(userId);
        if (user == null) {
            throw new RuntimeException("Không tìm thấy người dùng với ID: " + userId);
        }
        user.setIsActive(false);
        user.setReasonBanned(reason);
        User savedUser = userRepository.save(user);
        contextEmail.sendPermanentBanEmail(
                savedUser.getEmail(),
                savedUser.getFullName(),
                reason
        );
        return "Đã khóa tài khoản id " + userId;
    }

    public String addSpecialty(Specialty req) {
        String name = req.getSpecialtyName().trim();

        // Kiểm tra trùng tên
        if (specialtyRepository.existsBySpecialtyNameIgnoreCase(name)) {
            throw new RuntimeException("Chuyên khoa '" + name + "' đã tồn tại trong hệ thống!");
        }

        docbooking.models.Specialty specialty = docbooking.models.Specialty.builder()
                .specialtyName(name)
                .description(req.getDescription())
                .isActive(true)
                .build();
        specialtyRepository.save(specialty);
        return "Đã thêm chuyên khoa";
    }

    public String updateSpecialty(Integer specialtyId, Specialty req) {
        docbooking.models.Specialty specialty = specialtyRepository.findById(specialtyId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chuyên khoa!"));

        String newName = req.getSpecialtyName().trim();

        // KIỂM TRA TRÙNG:
        if (specialtyRepository.existsBySpecialtyNameIgnoreCaseAndSpecialtyIdNot(newName, specialtyId)) {
            throw new RuntimeException("Tên chuyên khoa '" + newName + "' đã được sử dụng bởi một chuyên khoa khác!");
        }

        specialty.setSpecialtyName(newName);
        specialty.setDescription(req.getDescription());
        specialtyRepository.save(specialty);
        return "Đã sửa thành công chuyên khoa";
    }

    public String deleteSpecialty(Integer specialtyId) {
        try {
            docbooking.models.Specialty specialty = specialtyRepository.findBySpecialtyId(specialtyId);
            specialty.setIsActive(false);
            specialtyRepository.save(specialty);
            return "Đã xóa chuyên ngành!";
        } catch (Exception e) {
            return e.getMessage();
        }
    }

    @Transactional
    public String addFacility(Facility req) {
        // 1. Chuẩn hóa tên
        String name = req.getFacilityName().trim();

        // 2. Kiểm tra trùng tên toàn hệ thống
        if (facilityRepository.existsByFacilityNameIgnoreCase(name)) {
            throw new RuntimeException("Cơ sở y tế '" + name + "' đã tồn tại!");
        }

        docbooking.models.Facility facility = docbooking.models.Facility.builder()
                .address(req.getAddress())
                .description(req.getDescription())
                .facilityName(name)
                .imageUrl(convertUrl.getUrlFile(req.getFile()))
                .isActive(true)
                .build();
        facilityRepository.save(facility);
        return "Đã thêm thành công cơ sở y tế";
    }

    @Transactional
    public String updateFacility(Integer facilityId, Facility req) {
        // 1. Kiểm tra tồn tại
        docbooking.models.Facility facility = facilityRepository.findByFacilityId(facilityId);
        if (facility == null) {
            throw new RuntimeException("Không tìm thấy cơ sở y tế!");
        }

        // 2. Chuẩn hóa tên mới
        String newName = req.getFacilityName().trim();

        // 3. Kiểm tra xem tên mới có trùng với cơ sở nào KHÁC không
        if (facilityRepository.existsByFacilityNameIgnoreCaseAndFacilityIdNot(newName, facilityId)) {
            throw new RuntimeException("Tên '" + newName + "' đã được sử dụng bởi một cơ sở khác!");
        }

        // 4. Cập nhật thông tin
        facility.setAddress(req.getAddress());
        facility.setFacilityName(newName);
        facility.setDescription(req.getDescription());

        // Chỉ cập nhật ảnh nếu người dùng có gửi file mới
        if (req.getFile() != null && !req.getFile().isEmpty()) {
            facility.setImageUrl(convertUrl.getUrlFile(req.getFile()));
        }
        facilityRepository.save(facility);
        return "Đã cập nhật thông tin cơ sở y tế";
    }

    public String deleteFacility(Integer facilityId) {
        try {
            docbooking.models.Facility facility = facilityRepository.findByFacilityId(facilityId);
            facility.setIsActive(false);
            facilityRepository.save(facility);
            return "Đã xóa thành công cơ sở!";
        } catch (Exception e) {
            return e.getMessage();
        }
    }

    public List<Appointment> getAllAppointments(LocalDateTime dateFrom, LocalDateTime dateTo, Appointment.BookingStatus status) {
        if (dateFrom.isAfter(dateTo)) {
            throw new RuntimeException("Ngày bắt đầu không được lớn hơn ngày kết thúc!");
        }

        List<Appointment> appointments = appointmentRepository.findAllByPeriodAndStatus(dateFrom, dateTo, status);

        return appointments;
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    @Transactional
    public String rejectReview(Integer id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài đánh giá với ID: " + id));
        review.setIsVisible(false);
        reviewRepository.save(review);

        return "Đã ẩn bài đánh giá thành công";
    }


    public List<Contact> getAllContacts(Contact.ContactStatus status) {
        if (status != null) {
            return contactRepository.findAllByStatusOrderByCreatedAtDesc(status);
        }
        return contactRepository.findAllByOrderByCreatedAtDesc();
    }

    /**
     * Đánh dấu một contact là đã đọc (READ).
     */
    @Transactional
    public Contact markContactAsRead(Integer contactId) {
        Contact contact = contactRepository.findById(contactId)
                .orElseThrow(() -> new RuntimeException(
                        "Không tìm thấy tin nhắn với ID: " + contactId));
        contact.setStatus(Contact.ContactStatus.READ);
        return contactRepository.save(contact);
    }

    @Transactional
    public String replyContact(Integer contactId, ContactReply req) {
        // 1. Tìm contact theo ID
        Contact contact = contactRepository.findById(contactId)
                .orElseThrow(() -> new RuntimeException(
                        "Không tìm thấy lời nhắn với ID: " + contactId));

        // 2. Gửi email phản hồi tới người gửi
        contextEmail.sendContactReplyEmail(
                contact.getEmail(),
                contact.getFullName(),
                contact.getSubject(),
                req.getReplyMessage()
        );

        // 3. Đánh dấu đã đọc sau khi phản hồi
        contact.setStatus(Contact.ContactStatus.READ);
        contactRepository.save(contact);

        return "Đã gửi phản hồi tới " + contact.getEmail();
    }

}
