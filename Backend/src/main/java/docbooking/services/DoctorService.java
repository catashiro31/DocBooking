package docbooking.services;

import docbooking.dtos.requests.ChangeDoctorProfileRequestDTO;
import docbooking.dtos.requests.DoctorProfileRequestDTO;
import docbooking.dtos.requests.MedicalResultRequestDTO;
import docbooking.dtos.responses.*;
import docbooking.models.*;
import docbooking.repositories.*;
import docbooking.utils.FileUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import docbooking.dtos.requests.BulkScheduleRequestDTO;

import javax.print.Doc;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorService {
    private final DoctorDetailRepository doctorDetailRepository;
    private final SpecialtyRepository specialtyRepository;
    private final FacilityRepository facilityRepository;
    private final DoctorScheduleRepository doctorScheduleRepository;
    private final FileUtil fileUtil;
    private final ReviewRepository reviewRepository;
    private final AppointmentRepository appointmentRepository;
    private final MedicalResultRepository medicalResultRepository;

    @Transactional
    public String completeProfile(User user, DoctorProfileRequestDTO req) {
        if (doctorDetailRepository.existsByUser(user)) {
            throw new RuntimeException("Hồ sơ đã tồn tại, vui lòng đợi duyệt!");
        }

        Specialty specialty = specialtyRepository.findById(req.getSpecialtyId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chuyên khoa"));
        Facility facility = facilityRepository.findById(req.getFacilityId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cơ sở y tế"));

        DoctorDetail doctorDetail = DoctorDetail.builder()
                .user(user)
                .specialty(specialty)
                .facility(facility)
                .bio(req.getBio())
                .degree(req.getDegree())
                .experienceYears(req.getExperienceYears())
                .price(req.getPrice())
                .idCardUrl(fileUtil.getUrlFile(req.getIdCardImage()))
                .certificateUrl(fileUtil.getUrlFile(req.getCertificatePdf()))
                .verificationStatus(DoctorDetail.VerificationStatus.PENDING)
                .ratingAverage(0.0)
                .reviewCount(0)
                .build();

        doctorDetailRepository.save(doctorDetail);
        return "Hồ sơ của bạn đã được gửi đi thành công!";
    }

    @Transactional
    public void createDoctorSchedule(Integer userId, BulkScheduleRequestDTO bulkScheduleRequestDTO) {
        DoctorDetail doctor = doctorDetailRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin bác sĩ."));

        for(String slotName: bulkScheduleRequestDTO.getSlotIds()){
            DoctorSchedule.TimeSlot timeSlot = DoctorSchedule.TimeSlot.valueOf(slotName);

            if(doctorScheduleRepository.existsByDoctor_DoctorIdAndDateWorkingAndTimeSlot(
                    doctor.getDoctorId(), bulkScheduleRequestDTO.getDate(), timeSlot)){
                continue;
            }
            DoctorSchedule doctorSchedule = new DoctorSchedule();
            doctorSchedule.setDoctor(doctor);
            doctorSchedule.setDateWorking(bulkScheduleRequestDTO.getDate());
            doctorSchedule.setTimeSlot(timeSlot);

            doctorSchedule.setSlotStatus(DoctorSchedule.SlotStatus.AVAILABLE);
            doctorScheduleRepository.save(doctorSchedule);
        }
    }
    public List<DoctorScheduleResponseDTO> getDoctorSchedules(Integer userId) {
        DoctorDetail doctor = doctorDetailRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin bác sĩ"));
        List<DoctorSchedule> schedules = doctorScheduleRepository.findByDoctor_DoctorIdOrderByDateWorkingDesc(doctor.getDoctorId());

        return schedules.stream().map(schedule -> DoctorScheduleResponseDTO.builder()
                .scheduleId(schedule.getScheduleId())
                .dateWorking(schedule.getDateWorking())
                .timeSlot(schedule.getTimeSlot().getDisplayValue())
                .slotStatus(schedule.getSlotStatus().name())
                .build()).toList();
    }

    @Transactional
    public void deleteDoctorSchedule(Integer userId, Integer scheduleId) {
        DoctorDetail doctor = doctorDetailRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin bác sĩ!"));

        DoctorSchedule schedule = doctorScheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin lịch!"));

        if(!schedule.getDoctor().getDoctorId().equals(doctor.getDoctorId())){
            throw new RuntimeException("Bạn không quyền xóa lịch trình của người khác!");
        }

        if(schedule.getSlotStatus() != DoctorSchedule.SlotStatus.AVAILABLE){
            throw new RuntimeException("Không thể xóa! Lịch trình này đã có người đặt hoặc đóng!");
        }
        doctorScheduleRepository.deleteSchedule(scheduleId);
    }
    @Transactional(readOnly = true)
    public DoctorProfileResponseDTO getDoctorProfile(User user) {
        DoctorDetail detail = doctorDetailRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Hồ sơ bác sĩ chưa được tạo!"));

        return DoctorProfileResponseDTO.builder()
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .avatarUrl(user.getAvatarUrl())
                .bio(detail.getBio())
                .degree(detail.getDegree())
                .experienceYears(detail.getExperienceYears())
                .price(detail.getPrice())
                .specialtyName(detail.getSpecialty().getSpecialtyName())
                .facilityName(detail.getFacility().getFacilityName())
                .facilityAddress(detail.getFacility().getAddress())
                .ratingAverage(detail.getRatingAverage())
                .reviewCount(detail.getReviewCount())
                .verificationStatus(detail.getVerificationStatus().name())
                .build();
    }
    @Transactional
    public DoctorProfileResponseDTO updateDoctorProfile(User currentUser, ChangeDoctorProfileRequestDTO req) {
        DoctorDetail detail = doctorDetailRepository.findByUser(currentUser)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ để cập nhật!"));
        if (req.getBio() != null) detail.setBio(req.getBio());
        if (req.getPrice() != null) detail.setPrice(req.getPrice());
        DoctorDetail savedDetail = doctorDetailRepository.save(detail);
        return getDoctorProfile(currentUser);
    }

    public List<ReviewResponseDTO> getDoctorReviews(User user) {
        List<Review> review = reviewRepository.findByAppointment_Schedule_Doctor_UserOrderByCreatedAtDesc(user);

        return review.stream().map(reviews -> ReviewResponseDTO.builder()
                .reviewId(reviews.getReviewId())
                .rating(reviews.getRating())
                .comment(reviews.getComment())
                .patientName(reviews.getAppointment().getPatient().getFullName())
                .createdAt(reviews.getCreatedAt())
                .build()).toList();
    }

    public List<DoctorAppointmentResponseDTO> getDoctorAppointment(User user) {
        List<Appointment> appointment = appointmentRepository.findBySchedule_Doctor_UserOrderBySchedule_DateWorkingDescSchedule_TimeSlotAsc(user);
        return appointment.stream().map(app -> {
            DoctorSchedule schedule = app.getSchedule();
            PatientProfile patient = app.getPatient();
            return DoctorAppointmentResponseDTO.builder()
                    .appointmentId(app.getId())
                    .patientName(patient.getFullName())
                    .patientPhoneNumber(patient.getPhoneNumber())
                    .patientGender(patient.getGender() != null ? patient.getGender().name() : null)
                    .dateWorking(schedule.getDateWorking())
                    .timeSlot(schedule.getTimeSlot().name())
                    .reason(app.getReason())
                    .bookingStatus(app.getBookingStatus().name())
                    .createdAt(app.getCreatedAt())
                    .build();
        }).toList();
    }

    @Transactional
    public void updateAppointmentStatus(User user, Integer appointmentId, Appointment.BookingStatus newStatus) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cuộc hẹn!"));
        Integer ownerId = appointment.getSchedule().getDoctor().getUser().getUserId();
        if(!ownerId.equals(user.getUserId())) {
            throw new RuntimeException("Bạn không có quyền chỉnh sửa cuộc hẹn này!");
        }
        appointment.setBookingStatus(newStatus);
        appointmentRepository.save(appointment);
    }

    @Transactional
    public String submitMedicalResult(User doctorUser, Integer appointmentId, MedicalResultRequestDTO req) {
        Appointment app = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn!"));

        if (!app.getSchedule().getDoctor().getUser().getUserId().equals(doctorUser.getUserId())) {
            throw new RuntimeException("Bạn không có quyền trả kết quả cho lịch hẹn này!");
        }

        if (medicalResultRepository.findByAppointmentId(appointmentId).isPresent()) {
            throw new RuntimeException("Lịch hẹn này đã có kết quả khám!");
        }

        MedicalResult result = MedicalResult.builder()
                .appointment(app)
                .diagnosis(req.getDiagnosis())
                .doctorNotes(req.getDoctorNotes())
                .prescriptionUrl(fileUtil.getUrlFile(req.getPrescriptionFile()))
                .build();

        medicalResultRepository.save(result);

        app.setBookingStatus(Appointment.BookingStatus.COMPLETED);
        appointmentRepository.save(app);

        return "Đã trả kết quả khám thành công!";
    }

    @Transactional
    public String updateMedicalResult(User doctorUser, Integer appointmentId, MedicalResultRequestDTO req) {
        MedicalResult result = medicalResultRepository.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new RuntimeException("Chưa có kết quả khám để chỉnh sửa!"));

        if (!result.getAppointment().getSchedule().getDoctor().getUser().getUserId().equals(doctorUser.getUserId())) {
            throw new RuntimeException("Bạn không có quyền chỉnh sửa kết quả này!");
        }

        if (req.getDiagnosis() != null) result.setDiagnosis(req.getDiagnosis());
        if (req.getDoctorNotes() != null) result.setDoctorNotes(req.getDoctorNotes());

        if (req.getPrescriptionFile() != null && !req.getPrescriptionFile().isEmpty()) {
            result.setPrescriptionUrl(fileUtil.getUrlFile(req.getPrescriptionFile()));
        }

        medicalResultRepository.save(result);
        return "Đã cập nhật kết quả khám!";
    }

}
