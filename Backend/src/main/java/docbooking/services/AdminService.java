package docbooking.services;

import docbooking.dtos.AppointmentStats;
import docbooking.dtos.requests.FacilityRequestDTO;
import docbooking.dtos.requests.SpecialtyRequestDTO;
import docbooking.dtos.responses.StatResponseDTO;
import docbooking.models.*;
import docbooking.repositories.*;
import docbooking.utils.EmailUtil;
import docbooking.utils.FileUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdminService {
    private final DoctorDetailRepository doctorDetail;
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final SpecialtyRepository specialtyRepository;
    private final FacilityRepository facilityRepository;
    private final FileUtil fileUtil;
    private final EmailUtil emailUtil;

    public AdminService(DoctorDetailRepository doctorDetail, PatientProfileRepository patientProfile, AppointmentRepository appointment, AppointmentRepository appointmentRepository, UserRepository userRepository, SpecialtyRepository specialtyRepository, FacilityRepository facilityRepository, FileUtil fileUtil, EmailUtil emailUtil) {
        this.doctorDetail = doctorDetail;
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
        this.specialtyRepository = specialtyRepository;
        this.facilityRepository = facilityRepository;
        this.fileUtil = fileUtil;
        this.emailUtil = emailUtil;
    }

    public StatResponseDTO getStats(LocalDateTime start, LocalDateTime end) {
        // 1. Lấy dữ liệu gộp từ Repo (Chỉ 1 lần truy vấn DB)
        AppointmentStats appStats = appointmentRepository.getAppointmentStatsByPeriod(start, end);

        // 2. Xử lý nếu appStats bị null (để tránh lỗi .getCompleted() bị null)
        if (appStats == null) {
            appStats = new AppointmentStats(0, 0, 0);
        }

        // 3. Đóng gói vào kết quả trả về
        return StatResponseDTO.builder()
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
        emailUtil.sendDoctorApprovedEmail(email, fullName);
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
        emailUtil.sendDoctorRejectedEmail(email, fullName, reason);
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
        emailUtil.sendPermanentBanEmail(
                savedUser.getEmail(),
                savedUser.getFullName(),
                reason
        );
        return "Đã khóa tài khoản id " + userId;
    }

    public String addSpecialty(SpecialtyRequestDTO req) {
        String name = req.getSpecialtyName().trim();

        // Kiểm tra trùng tên
        if (specialtyRepository.existsBySpecialtyNameIgnoreCase(name)) {
            throw new RuntimeException("Chuyên khoa '" + name + "' đã tồn tại trong hệ thống!");
        }

        Specialty specialty = Specialty.builder()
                .specialtyName(name)
                .description(req.getDescription())
                .isActive(true)
                .build();
        specialtyRepository.save(specialty);
        return "Đã thêm chuyên khoa";
    }

    public String updateSpecialty(Integer specialtyId, SpecialtyRequestDTO req) {
        Specialty specialty = specialtyRepository.findById(specialtyId)
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
            Specialty specialty = specialtyRepository.findBySpecialtyId(specialtyId);
            specialty.setIsActive(true);
            specialtyRepository.save(specialty);
            return "Đã xóa chuyên ngành!";
        } catch (Exception e) {
            return e.getMessage();
        }
    }

    @Transactional
    public String addFacility(FacilityRequestDTO req) {
        // 1. Chuẩn hóa tên
        String name = req.getFacilityName().trim();

        // 2. Kiểm tra trùng tên toàn hệ thống
        if (facilityRepository.existsByFacilityNameIgnoreCase(name)) {
            throw new RuntimeException("Cơ sở y tế '" + name + "' đã tồn tại!");
        }

        Facility facility = Facility.builder()
                .address(req.getAddress())
                .description(req.getDescription())
                .facilityName(name)
                .imageUrl(fileUtil.getUrlFile(req.getFile()))
                .isActive(true)
                .build();
        facilityRepository.save(facility);
        return "Đã thêm thành công cơ sở y tế";
    }

    @Transactional
    public String updateFacility(Integer facilityId, FacilityRequestDTO req) {
        // 1. Kiểm tra tồn tại
        Facility facility = facilityRepository.findByFacilityId(facilityId);
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
            facility.setImageUrl(fileUtil.getUrlFile(req.getFile()));
        }
        facilityRepository.save(facility);
        return "Đã cập nhật thông tin cơ sở y tế";
    }

    public String deleteFacility(Integer facilityId) {
        try {
            Facility facility = facilityRepository.findByFacilityId(facilityId);
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

    @Transactional
    public String confirmPayment(Integer id) {
        // 1. Tìm lịch hẹn theo ID
        // Giả sử Repo của bạn dùng findById hoặc findByAppointmentId
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn với ID: " + id));

        // 2. Cập nhật trạng thái thành 'Đã thanh toán' (CONFIRMED hoặc APPROVED)
        // Tùy vào Enum BookingStatus của Tiến nhé
        appointment.setPaymentStatus(Appointment.PaymentStatus.PAID);

        // 3. Lưu thay đổi vào Database
        Appointment savedApp = appointmentRepository.save(appointment);

        // 4. Gửi email xác nhận thanh toán thành công
        // Lấy thông tin từ các Object liên kết (User, Doctor, Specialty)
        String email = savedApp.getPatient().getUser().getEmail();
        String fullName = savedApp.getPatient().getFullName();
        String appDate = savedApp.getSchedule().getDateWorking().toString(); // Nên format lại dd/MM/yyyy
        String doctorName = savedApp.getSchedule().getDoctor().getUser().getFullName();

        emailUtil.sendPaymentSuccessEmail(
                email,
                fullName,
                savedApp.getId().toString(),
                appDate,
                doctorName
        );

        return "Đã chấp nhận thanh toán thành công";
    }
}
