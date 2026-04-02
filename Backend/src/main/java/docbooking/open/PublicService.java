package docbooking.open;

import docbooking.doctor.responses.Review;
import docbooking.models.DoctorSchedule;
import docbooking.open.responses.*;
import docbooking.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.criteria.Predicate;

import java.util.stream.Collectors;

import org.springframework.cache.annotation.Cacheable;

@RequiredArgsConstructor
@Service
public class PublicService {
    private final DoctorScheduleRepository doctorScheduleRepository;
    private final DoctorDetailRepository doctorDetailRepository;
    private final ReviewRepository reviewRepository;
    private final SpecialtyRepository specialtyRepository;
    private final FacilityRepository facilityRepository;
    private final AppointmentRepository appointmentRepository;

    public PortalStats getPortalStats() {
        long totalDoctors = doctorDetailRepository.countByVerificationStatus(docbooking.models.DoctorDetail.VerificationStatus.APPROVED);
        long totalAppointments = appointmentRepository.count();
        
        // Calculate global average rating from approved doctors using DB query
        Double avgRating = doctorDetailRepository.getAverageRatingByVerificationStatus(docbooking.models.DoctorDetail.VerificationStatus.APPROVED);
        if (avgRating == null) {
            avgRating = 5.0;
        }
        
        return PortalStats.builder()
                .totalDoctors(totalDoctors)
                .totalAppointments(totalAppointments)
                .averageRating(Math.round(avgRating * 10.0) / 10.0)
                .build();
    }

    @Cacheable("facilities")
    public List<Facilities> getAllFacilities() {
        return facilityRepository.findAllByIsActiveTrue().stream()
                .map(f -> Facilities.builder()
                        .id(f.getFacilityId())
                        .name(f.getFacilityName())
                        .address(f.getAddress())
                        .description(f.getDescription())
                        .imageUrl(f.getImageUrl())
                        .licenseUrl(f.getLicenseUrl())
                        .mapUrl(f.getMapUrl())
                        .verified(Boolean.TRUE.equals(f.getIsVerified()))
                        .build())
                .toList();
    }
    
    @Cacheable("specialties")
    public List<Specialties> getAllSpecialties() {
        return specialtyRepository.findAllByIsActiveTrue().stream()
                .map(s -> Specialties.builder()
                        .id(s.getSpecialtyId())
                        .name(s.getSpecialtyName())
                        .description(s.getDescription())
                        .build())
                .toList();
    }
    public Page<DoctorCards> getDoctors(String name , Integer specialityId, Integer facilityId, Double minPrice, Double maxPrice, Pageable pageable) {
        Specification<docbooking.models.DoctorDetail> specification = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.equal(root.get("verificationStatus"), docbooking.models.DoctorDetail.VerificationStatus.APPROVED));
            if (name != null && !name.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("user").get("fullName")), "%" + name.toLowerCase() + "%"));
            }

            if (specialityId != null) {
                predicates.add(cb.equal(root.get("specialty").get("specialtyId"), specialityId));
            }

            if (facilityId != null) {
                predicates.add(cb.equal(root.get("facility").get("facilityId"), facilityId));
            }

            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        Page<docbooking.models.DoctorDetail> doctors = doctorDetailRepository.findAll(specification, pageable);
        return doctors.map(doctor -> DoctorCards.builder()
                .doctorId(doctor.getDoctorId())
                .doctorName(doctor.getUser().getFullName())
                .specialtyName(doctor.getSpecialty().getSpecialtyName())
                .doctorEmail(doctor.getUser().getEmail())
                .doctorPhone(doctor.getUser().getPhoneNumber())
                .avatarUrl(doctor.getUser().getAvatarUrl())
                .ratingAverage(doctor.getRatingAverage())
                .totalReviews(doctor.getReviewCount())
                .price(doctor.getPrice())
                .experience(doctor.getExperienceYears())
                .build()
        );
    }

    public DoctorDetails getDoctorById(Integer doctorId){
        docbooking.models.DoctorDetail doctor = doctorDetailRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Bác sĩ với ID " + doctorId +" không tồn tại!"));

        if(doctor.getVerificationStatus() != docbooking.models.DoctorDetail.VerificationStatus.APPROVED){
            throw new RuntimeException("Thông tin bác sĩ này chưa được công khai!");
        }
        return DoctorDetails.builder()
                .id(doctor.getDoctorId())
                .fullName(doctor.getUser().getFullName())
                .specialtyName(doctor.getSpecialty().getSpecialtyName())
                .specialtyId(doctor.getSpecialty().getSpecialtyId())
                .degree(doctor.getDegree())
                .experienceYears(doctor.getExperienceYears())
                .price(doctor.getPrice())
                .bio(doctor.getBio())
                .facilityName(doctor.getFacility() != null ? doctor.getFacility().getFacilityName() : null)
                .facilityAddress(doctor.getFacility() != null ? doctor.getFacility().getAddress() : null)
                .facilityMapUrl(doctor.getFacility() != null ? doctor.getFacility().getMapUrl() : null)
                .doctorEmail(doctor.getUser().getEmail())
                .doctorPhone(doctor.getUser().getPhoneNumber())
                .avatarUrl(doctor.getUser().getAvatarUrl())
                .ratingAverage(doctor.getRatingAverage())
                .totalReviews(doctor.getReviewCount())
                .build();
    }
    public List<Review> getReviewsByDoctorId(Integer doctorId){
        List<docbooking.models.Review> reviews = reviewRepository.findByAppointment_Schedule_Doctor_DoctorIdAndIsVisibleTrueOrderByCreatedAtDesc(doctorId);
        return reviews.stream().map(review -> Review.builder()
                .reviewId(review.getReviewId())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .patientName(review.getAppointment().getPatient().getFullName())
                .build()
        ).collect(Collectors.toList());
    }

    public List<DoctorSlots> getAvailableSlots(Integer doctorId, LocalDate dateWorking){
        docbooking.models.DoctorDetail doctor = doctorDetailRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Bác sĩ không tồn tại!"));

        if (doctor.getVerificationStatus() != docbooking.models.DoctorDetail.VerificationStatus.APPROVED) {
            return new ArrayList<>();
        }
        List<DoctorSchedule> schedules = doctorScheduleRepository.findByDoctor_DoctorIdAndDateWorkingAndSlotStatus(
                doctorId, dateWorking, DoctorSchedule.SlotStatus.AVAILABLE);

        LocalDate today = LocalDate.now();
        LocalTime minBookingTime = LocalTime.now().plusHours(1);

        return schedules.stream()
                .filter(schedule -> {
                    // Nếu là ngày hôm nay, chỉ hiển thị slot còn ít nhất 1 tiếng nữa mới bắt đầu
                    if (dateWorking.isEqual(today)) {
                        LocalTime slotTime = docbooking.utils.Time.parseTimeSlot(schedule.getTimeSlot());
                        return slotTime.isAfter(minBookingTime);
                    }
                    return true;
                })
                .map(schedule -> DoctorSlots.builder()
                        .scheduleId(schedule.getScheduleId())
                        .timeSlot(schedule.getTimeSlot().getDisplayValue())
                        .slotStatus(schedule.getSlotStatus().name())
                        .build()
                ).collect(Collectors.toList());
    }
}
