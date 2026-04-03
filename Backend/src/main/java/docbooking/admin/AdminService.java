package docbooking.admin;

import docbooking.admin.requests.Facility;
import docbooking.admin.requests.Specialty;
import docbooking.admin.responses.AppointmentAdminResponse;
import docbooking.admin.responses.AppointmentStats;
import docbooking.admin.responses.ReviewAdminResponse;
import docbooking.admin.responses.Stat;
import docbooking.models.*;
import docbooking.repositories.*;
import docbooking.utils.ContextEmail;
import docbooking.utils.ConvertUrl;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.cache.annotation.CacheEvict;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import jakarta.annotation.PostConstruct;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final DoctorDetailRepository doctorDetail;
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final SpecialtyRepository specialtyRepository;
    private final FacilityRepository facilityRepository;
    private final ConvertUrl convertUrl;
    private final ContextEmail contextEmail;
    private final ReviewRepository reviewRepository;
    private final DoctorScheduleRepository doctorScheduleRepository;

    public Stat getStats(LocalDate start, LocalDate end) {
        // 1. Lấy dữ liệu gộp từ Repo (Chỉ 1 lần truy vấn DB)
        AppointmentStats appStats = appointmentRepository.getAppointmentStatsByPeriod(start, end);

        if (appStats == null) {
            appStats = new AppointmentStats(0, 0, 0);
        }

        LocalDateTime startDT = start.atStartOfDay();
        LocalDateTime endDT = end.plusDays(1).atStartOfDay();

        // Thống kê ngày hôm nay
        LocalDate today = LocalDate.now();
        AppointmentStats todayStats = appointmentRepository.getAppointmentStatsByPeriod(today, today);

        // 3. Đóng gói vào kết quả trả về
        return Stat.builder()
                .numberOfDoctors(userRepository.countByRoleAndIsActiveTrueAndCreatedAtBetween(User.RoleStatus.DOCTOR, startDT, endDT))
                .numberOfPatients(
                        userRepository.countByRoleAndIsActiveTrueAndCreatedAtBetween(User.RoleStatus.PATIENT, startDT, endDT))
                .numberOfSuccessAppointments(appStats.getCompleted())
                .numberOfPendingAppointments(appStats.getPending())
                .numberOfFailingAppointments(appStats.getCancelled())

                // Bổ sung các thông số tuyệt đối
                .totalUsers(userRepository.count())
                .totalDoctors(doctorDetail.countByVerificationStatusAndUser_IsActiveTrue(DoctorDetail.VerificationStatus.APPROVED))
                .totalPatients(userRepository.countByRoleAndIsActiveTrue(User.RoleStatus.PATIENT))
                .totalAppointments(appointmentRepository.count())
                .totalReviews(reviewRepository.countByIsVisibleTrue())
                .pendingDoctors(doctorDetail.countByVerificationStatus(DoctorDetail.VerificationStatus.PENDING))
                .todayAppointments(todayStats != null
                        ? (todayStats.getCompleted() + todayStats.getPending() + todayStats.getCancelled())
                        : 0)
                .build();
    }

    public Page<DoctorDetail> getAllDoctors(Pageable pageable) {
        Specification<DoctorDetail> spec = (root, query, cb) ->
            cb.equal(root.get("verificationStatus"), DoctorDetail.VerificationStatus.APPROVED);
        return doctorDetail.findAll(spec, pageable);
    }

    public List<DoctorDetail> getPendingDoctors() {
        return doctorDetail.findDoctorDetailByVerificationStatus(DoctorDetail.VerificationStatus.PENDING);
    }

    public DoctorDetail getDoctorDetail(Integer id) {
        DoctorDetail doctor = doctorDetail.findByDoctorId(id);
        if (doctor == null) {
            throw new RuntimeException("Không tìm thấy thông tin bác sĩ với ID: " + id);
        }
        return doctor;
    }

    @Transactional
    @CacheEvict(value = "facilities", allEntries = true)
    public DoctorDetail approveDoctor(Integer doctorId) {
        DoctorDetail doctor = doctorDetail.findByDoctorId(doctorId);
        if (doctor == null) {
            throw new RuntimeException("Không tìm thấy thông tin bác sĩ với ID: " + doctorId);
        }
        if (doctor.getVerificationStatus() != DoctorDetail.VerificationStatus.PENDING) {
            throw new RuntimeException("Chỉ có thể duyệt bác sĩ đang ở trạng thái chờ duyệt!");
        }
        doctor.setVerificationStatus(DoctorDetail.VerificationStatus.APPROVED);
        
        // Tự động xác minh luôn cơ sở y tế nếu nó đang ở trạng thái chờ duyệt
        if (doctor.getFacility() != null && !Boolean.TRUE.equals(doctor.getFacility().getIsVerified())) {
            doctor.getFacility().setIsVerified(true);
            facilityRepository.save(doctor.getFacility());
        }

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
        if (doctor.getVerificationStatus() != DoctorDetail.VerificationStatus.PENDING) {
            throw new RuntimeException("Chỉ có thể từ chối bác sĩ đang ở trạng thái chờ duyệt!");
        }
        doctor.setVerificationStatus(DoctorDetail.VerificationStatus.REJECTED);
        doctor.setReasonReject(reason);
        String email = doctor.getUser().getEmail();
        String fullName = doctor.getUser().getFullName();
        contextEmail.sendDoctorRejectedEmail(email, fullName, reason);
        doctorDetail.save(doctor);
        return doctor;
    }

    // Phân trang: nhận Pageable, trả về Page<User>
    public Page<User> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    @Transactional
    public String setBlockedUser(Integer userId, String reason) {
        User user = userRepository.findByUserId(userId);
        if (user == null) {
            throw new RuntimeException("Không tìm thấy người dùng với ID: " + userId);
        }
        user.setIsActive(false);
        user.setReasonBanned(reason);
        User savedUser = userRepository.save(user);

        // Hủy tất cả lịch hẹn đang active của user này (với tư cách bệnh nhân)
        List<Appointment.BookingStatus> activeStatuses = List.of(
                Appointment.BookingStatus.PENDING,
                Appointment.BookingStatus.CONFIRMED);
        List<Appointment> activeAppointments = appointmentRepository.findByPatient_User_UserIdAndBookingStatusIn(
                userId, activeStatuses);
        for (Appointment app : activeAppointments) {
            app.setBookingStatus(Appointment.BookingStatus.CANCELLED);
            appointmentRepository.save(app);
            // Mở lại slot nếu ngày khám chưa qua
            DoctorSchedule schedule = app.getSchedule();
            if (schedule != null && !schedule.getDateWorking().isBefore(LocalDate.now())) {
                schedule.setSlotStatus(DoctorSchedule.SlotStatus.AVAILABLE);
                doctorScheduleRepository.save(schedule);
            }
        }

        // Nếu user là bác sĩ, hủy tất cả lịch hẹn của bệnh nhân với bác sĩ này và đóng các slot
        if (savedUser.getRole() == User.RoleStatus.DOCTOR) {
            // Hủy tất cả appointment đang active của bác sĩ
            List<Appointment> doctorAppointments = appointmentRepository
                    .findBySchedule_Doctor_User_UserIdAndBookingStatusIn(
                            userId, activeStatuses);
            for (Appointment app : doctorAppointments) {
                app.setBookingStatus(Appointment.BookingStatus.CANCELLED);
                appointmentRepository.save(app);
            }
            // Đóng tất cả slot AVAILABLE của bác sĩ
            doctorScheduleRepository.closeAllAvailableSlotsByDoctorUserId(userId);
        }

        contextEmail.sendPermanentBanEmail(
                savedUser.getEmail(),
                savedUser.getFullName(),
                reason);
        return "Đã khóa tài khoản id " + userId;
    }

    public String unblockUser(Integer userId) {
        User user = userRepository.findByUserId(userId);
        if (user == null) {
            throw new RuntimeException("Không tìm thấy người dùng với ID: " + userId);
        }
        user.setIsActive(true);
        user.setReasonBanned(null);
        userRepository.save(user);
        return "Đã mở khóa tài khoản id " + userId;
    }

    @CacheEvict(value = "specialties", allEntries = true)
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

    @CacheEvict(value = "specialties", allEntries = true)
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

    @CacheEvict(value = "specialties", allEntries = true)
    public String deleteSpecialty(Integer specialtyId) {
        docbooking.models.Specialty specialty = specialtyRepository.findById(specialtyId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chuyên khoa với ID: " + specialtyId));
        
        if (doctorDetail.existsBySpecialty_SpecialtyId(specialtyId)) {
            throw new RuntimeException("Không thể xóa chuyên khoa này vì đang có bác sĩ thuộc chuyên khoa!");
        }

        specialty.setIsActive(false);
        specialtyRepository.save(specialty);
        return "Đã xóa chuyên ngành!";
    }

    @Transactional
    @CacheEvict(value = "facilities", allEntries = true)
    public String addFacility(Facility req) {
        // 1. Chuẩn hóa tên
        String name = req.getFacilityName().trim();

        // 2. Kiểm tra trùng tên toàn hệ thống
        if (facilityRepository.existsByFacilityNameIgnoreCase(name)) {
            throw new RuntimeException("Cơ sở y tế '" + name + "' đã tồn tại!");
        }

        if (req.getLicenseFile() == null || req.getLicenseFile().isEmpty()) {
            throw new RuntimeException("Vui lòng tải lên Giấy phép hoạt động cho cơ sở mới!");
        }

        docbooking.models.Facility facility = docbooking.models.Facility.builder()
                .address(req.getAddress())
                .description(req.getDescription())
                .facilityName(name)
                .province(req.getProvince())
                .imageUrl(convertUrl.getUrlFile(req.getFile()))
                .licenseUrl(convertUrl.getUrlFile(req.getLicenseFile()))
                .mapUrl(req.getMapUrl())
                .isActive(true)
                .isVerified(true) // Admin tạo mặc định là đã xác minh
                .build();
        facilityRepository.save(facility);
        return "Đã thêm thành công cơ sở y tế";
    }

    @Transactional
    @CacheEvict(value = "facilities", allEntries = true)
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
        facility.setMapUrl(req.getMapUrl());
        facility.setProvince(req.getProvince());

        // Chỉ cập nhật ảnh nếu người dùng có gửi file mới
        if (req.getFile() != null && !req.getFile().isEmpty()) {
            facility.setImageUrl(convertUrl.getUrlFile(req.getFile()));
        }

        if (req.getLicenseFile() != null && !req.getLicenseFile().isEmpty()) {
            facility.setLicenseUrl(convertUrl.getUrlFile(req.getLicenseFile()));
        }
        facilityRepository.save(facility);
        return "Đã cập nhật thông tin cơ sở y tế";
    }

    @Transactional
    @CacheEvict(value = "facilities", allEntries = true)
    public String verifyFacility(Integer facilityId) {
        docbooking.models.Facility facility = facilityRepository.findById(facilityId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cơ sở y tế!"));
        if (!Boolean.TRUE.equals(facility.getIsActive())) {
            throw new RuntimeException("Cơ sở y tế đã ngừng hoạt động, không thể xác minh!");
        }
        facility.setIsVerified(true);
        facilityRepository.save(facility);
        return "Đã xác minh cơ sở y tế";
    }

    @CacheEvict(value = "facilities", allEntries = true)
    public String deleteFacility(Integer facilityId) {
        docbooking.models.Facility facility = facilityRepository.findById(facilityId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cơ sở y tế với ID: " + facilityId));
        
        if (doctorDetail.existsByFacility_FacilityId(facilityId)) {
            throw new RuntimeException("Không thể xóa cơ sở y tế này vì đang có bác sĩ đang công tác!");
        }

        facility.setIsActive(false);
        facilityRepository.save(facility);
        return "Đã xóa thành công cơ sở!";
    }

    public Page<AppointmentAdminResponse> getAllAppointments(LocalDateTime dateFrom, LocalDateTime dateTo,
            Appointment.BookingStatus status, Pageable pageable) {
        if (dateFrom.isAfter(dateTo)) {
            throw new RuntimeException("Ngày bắt đầu không được lớn hơn ngày kết thúc!");
        }
        Page<Appointment> appointments = appointmentRepository.findAllByPeriodAndStatus(dateFrom, dateTo, status,
                pageable);

        return appointments.map(this::mapToAdminResponse);
    }

    private AppointmentAdminResponse mapToAdminResponse(Appointment a) {
        DoctorSchedule s = a.getSchedule();
        DoctorDetail d = s != null ? s.getDoctor() : null;
        User doctorUser = d != null ? d.getUser() : null;
        PatientProfile p = a.getPatient();
        User patientUser = p != null ? p.getUser() : null;

        return AppointmentAdminResponse.builder()
                .appointmentId(a.getId())
                .patientId(p != null ? p.getPatientId() : null)
                .patientName(patientUser != null ? patientUser.getFullName() : p != null ? p.getFullName() : "N/A")
                .patientPhone(patientUser != null ? patientUser.getPhoneNumber() : "N/A")
                .patientEmail(patientUser != null ? patientUser.getEmail() : "N/A")
                .doctorId(d != null ? d.getDoctorId() : null)
                .doctorName(doctorUser != null ? doctorUser.getFullName() : "N/A")
                .specialtyName(d != null && d.getSpecialty() != null ? d.getSpecialty().getSpecialtyName() : "N/A")
                .facilityName(d != null && d.getFacility() != null ? d.getFacility().getFacilityName() : "N/A")
                .dateWorking(s != null ? s.getDateWorking() : null)
                .timeSlot(s != null && s.getTimeSlot() != null
                        ? s.getTimeSlot().name().replace("SLOT_", "").replace("_", ":")
                        : "N/A")
                .reason(a.getReason())
                .bookingStatus(a.getBookingStatus())
                .createdAt(a.getCreatedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public Page<ReviewAdminResponse> getAllReviews(Pageable pageable) {
        return reviewRepository.findAll(pageable).map(this::reviewToResponse);
    }

    private ReviewAdminResponse reviewToResponse(Review r) {
        Appointment a = r.getAppointment();
        PatientProfile p = a != null ? a.getPatient() : null;
        User patientUser = p != null ? p.getUser() : null;
        
        DoctorSchedule s = a != null ? a.getSchedule() : null;
        DoctorDetail d = s != null ? s.getDoctor() : null;
        User doctorUser = d != null ? d.getUser() : null;
        Map<String, Double> aiLabels = analyzeComment(r.getComment());

        return ReviewAdminResponse.builder()
                .reviewId(r.getReviewId())
                .patientName(patientUser != null ? patientUser.getFullName() : p != null ? p.getFullName() : "N/A")
                .doctorName(doctorUser != null ? doctorUser.getFullName() : "N/A")
                .rating(r.getRating())
                .comment(r.getComment())
                .createdAt(r.getCreatedAt())
                .isVisible(r.getIsVisible())
                .aiLabels(aiLabels.isEmpty() ? null : aiLabels)
                .build();
    }

    @Transactional
    public String rejectReview(Integer id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài đánh giá với ID: " + id));
        review.setIsVisible(false);
        reviewRepository.save(review);

        // Cập nhật lại rating bác sĩ sau khi ẩn review
        Integer doctorId = review.getAppointment().getSchedule().getDoctor().getDoctorId();
        updateDoctorStats(doctorId);

        return "Đã ẩn bài đánh giá thành công";
    }

    private void updateDoctorStats(Integer doctorId) {
        DoctorDetail doctor = doctorDetail.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin bác sĩ."));

        List<Review> reviews = reviewRepository.findByAppointment_Schedule_Doctor_DoctorId(doctorId)
                .stream()
                .filter(r -> r.getIsVisible())
                .toList();
        doctor.setReviewCount(reviews.size());

        double average = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
        doctor.setRatingAverage(Math.round(average * 10.0) / 10.0);

        doctorDetail.save(doctor);
    }

    // ==========================================
    // MODULE: AI NAIVE BAYES CHO PHÂN LOẠI REVIEW
    // ==========================================
    public static final String POSITIVE = "Tích cực";
    public static final String NEGATIVE = "Tiêu cực";
    public static final String ADVERTISING = "Quảng cáo";
    public static final String PROFANITY = "Thô tục";
    private static final List<String> LABELS = Arrays.asList(POSITIVE, NEGATIVE, ADVERTISING, PROFANITY);

    private volatile AIModel aiModel = AIModel.empty();

    private record AIModel(Map<String, double[]> wordLogProbs, double[] classPriors) {
        static AIModel empty() {
            return new AIModel(Collections.emptyMap(), new double[] { Math.log(0.25), Math.log(0.25), Math.log(0.25), Math.log(0.25) });
        }
    }

    @PostConstruct
    public void trainAIEngine() {
        Map<String, List<String>> seeds = new HashMap<>();
        seeds.put(POSITIVE, loadSeedsFromFile("positive.txt"));
        seeds.put(NEGATIVE, loadSeedsFromFile("negative.txt"));
        seeds.put(ADVERTISING, loadSeedsFromFile("advertising.txt"));
        seeds.put(PROFANITY, loadSeedsFromFile("profanity.txt"));

        Map<String, Integer> vocab = new HashMap<>();
        int[] classTotalWords = new int[4];
        Map<String, int[]> wordCounts = new HashMap<>();
        int[] classDocCount = new int[4];
        long totalDocs = 0;

        for (int i = 0; i < 4; i++) {
            List<String> texts = seeds.get(LABELS.get(i));
            if (texts == null) continue;
            classDocCount[i] = texts.size();
            totalDocs += texts.size();

            for (String txt : texts) {
                if (txt == null || txt.isBlank()) continue;
                String normalized = txt.toLowerCase().replaceAll("[^a-z0-9\\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\\-]++", " ").replaceAll("\\s++", " ").trim();
                if (normalized.isEmpty()) continue;

                String[] tokens = normalized.split("\\s+");
                classTotalWords[i] += tokens.length;
                for (String t : tokens) {
                    if (t.isEmpty()) continue;
                    vocab.put(t, vocab.getOrDefault(t, 0) + 1);
                    int[] c = wordCounts.computeIfAbsent(t, k -> new int[4]);
                    c[i]++;
                }
            }
        }

        double[] priors = new double[4];
        for (int i = 0; i < 4; i++) {
            priors[i] = Math.log((double) (classDocCount[i] + 1) / (totalDocs + 4));
        }

        Map<String, double[]> localWordLogProbs = new HashMap<>();
        for (Map.Entry<String, int[]> e : wordCounts.entrySet()) {
            double[] probs = new double[4];
            for (int i = 0; i < 4; i++) probs[i] = Math.log((double) (e.getValue()[i] + 1) / (classTotalWords[i] + vocab.size()));
            localWordLogProbs.put(e.getKey(), probs);
        }

        aiModel = new AIModel(Collections.unmodifiableMap(localWordLogProbs), priors);
    }

    public synchronized void refreshAIEngine() {
        trainAIEngine();
    }

    public Map<String, Double> analyzeComment(String text) {
        if (text == null || text.isBlank()) return Collections.emptyMap();
        
        String norm = text.toLowerCase().replaceAll("[^a-z0-9\\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\\-]++", " ").replaceAll("\\s++", " ").trim();
        if (norm.isEmpty()) return Collections.emptyMap();

        AIModel snapshot = aiModel;
        String[] tokens = norm.split("\\s+");
        double[] scores = snapshot.classPriors().clone();

        for (String t : tokens) {
            double[] probs = snapshot.wordLogProbs().get(t);
            if (probs != null) {
                for (int i = 0; i < 4; i++) scores[i] += probs[i];
            }
        }

        double max = scores[0];
        for (double s : scores) if (s > max) max = s;
        double sum = 0;
        double[] exps = new double[4];
        for (int i = 0; i < 4; i++) {
            exps[i] = Math.exp(scores[i] - max);
            sum += exps[i];
        }

        Map<String, Double> results = new LinkedHashMap<>();
        for (int i = 0; i < 4; i++) {
            results.put(LABELS.get(i), Math.round((exps[i] / sum) * 1000.0) / 10.0);
        }
        return results;
    }

    private List<String> loadSeedsFromFile(String fileName) {
        InputStream is = getClass().getResourceAsStream("/ai/" + fileName);

        // Fallback: Thử đọc trực tiếp từ file system nếu không tìm thấy trong classpath (hữu ích khi dev)
        if (is == null) {
            try {
                // Thử các đường dẫn tương đối phổ biến
                String[] paths = {
                    "src/main/java/docbooking/utils/ai/" + fileName,
                    "Backend/src/main/java/docbooking/utils/ai/" + fileName
                };
                for (String p : paths) {
                    java.io.File file = new java.io.File(p);
                    if (file.exists()) {
                        is = new java.io.FileInputStream(file);
                        break;
                    }
                }
            } catch (Exception ignored) {}
        }

        if (is == null) return Collections.emptyList();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8))) {
            return reader.lines()
                    .filter(line -> line != null && !line.isBlank())
                    .map(String::trim)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }
}
