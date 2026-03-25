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

    public User setBlockedUser(Integer userId, String reason) {
        User user = userRepository.findByUserId(userId);
        user.setIsActive(false);
        user.setReasonBanned(reason);
        userRepository.save(user);
        return user;
    }

    public Specialty addSpecialty(SpecialtyRequestDTO req) {
        // 1. Chuẩn hóa dữ liệu đầu vào (loại bỏ dấu cách thừa)
        String name = req.getSpecialtyName().trim();

        // 2. Kiểm tra trùng tên
        if (specialtyRepository.existsBySpecialtyNameIgnoreCase(name)) {
            throw new RuntimeException("Chuyên khoa '" + name + "' đã tồn tại trong hệ thống!");
        }

        // 3. Nếu không trùng thì mới tiến hành Builder và Save
        Specialty specialty = Specialty.builder()
                .specialtyName(name)
                .description(req.getDescription())
                .build();

        return specialtyRepository.save(specialty);
    }

    public Specialty updateSpecialty(Integer specialtyId, SpecialtyRequestDTO req) {
        // 1. Tìm chuyên khoa hiện tại trong DB
        Specialty specialty = specialtyRepository.findById(specialtyId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chuyên khoa!"));

        // 2. Chuẩn hóa tên mới
        String newName = req.getSpecialtyName().trim();

        // 3. KIỂM TRA TRÙNG:
        // Tìm xem có AI KHÁC (IdNot) đang dùng cái tên (newName) này không
        if (specialtyRepository.existsBySpecialtyNameIgnoreCaseAndSpecialtyIdNot(newName, specialtyId)) {
            throw new RuntimeException("Tên chuyên khoa '" + newName + "' đã được sử dụng bởi một chuyên khoa khác!");
        }

        // 4. Nếu vượt qua kiểm tra, tiến hành cập nhật
        specialty.setSpecialtyName(newName);
        specialty.setDescription(req.getDescription());

        return specialtyRepository.save(specialty);
    }

    public String deleteSpecialty(Integer specialtyId) {
        try {
            Specialty specialty = specialtyRepository.findBySpecialtyId(specialtyId);
            specialtyRepository.delete(specialty);
            return "Đã xóa chuyên ngành!";
        } catch (Exception e) {
            return e.getMessage();
        }
    }

    public Facility addFacility(FacilityRequestDTO req) {

        Facility facility = Facility.builder()
                .address(req.getAddress())
                .description(req.getDescription())
                .facilityName(req.getFacilityName())
                .imageUrl(fileUtil.getUrlFile(req.getFile()))
                .build();
        return facilityRepository.save(facility);
    }

    public Facility updateFacility(Integer facilityId, FacilityRequestDTO req) {
        Facility facility = facilityRepository.findByFacilityId(facilityId);
        facility.setAddress(req.getAddress());
        facility.setFacilityName(req.getFacilityName());
        facility.setDescription(req.getDescription());
        facility.setImageUrl(fileUtil.getUrlFile(req.getFile()));
        return facilityRepository.save(facility);
    }

    public String deleteFacility(Integer facilityId) {
        try {
            Facility facility = facilityRepository.findByFacilityId(facilityId);
            facilityRepository.delete(facility);
            return "Đã xóa thành công cơ sở!";
        } catch (Exception e) {
            return e.getMessage();
        }
    }

}
