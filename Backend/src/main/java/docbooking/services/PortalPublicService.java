package docbooking.services;

import docbooking.dtos.responses.*;
import docbooking.models.DoctorDetail;
import docbooking.models.DoctorSchedule;
import docbooking.models.Review;
import docbooking.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.criteria.Predicate;

import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class PortalPublicService {
    private final DoctorScheduleRepository doctorScheduleRepository;
    private final DoctorDetailRepository doctorDetailRepository;
    private final ReviewRepository reviewRepository;
    private final SpecialtyRepository specialtyRepository;
    private final FacilityRepository facilityRepository;

    public List<FacilityResponseDTO> getAllFacilities() {
        return facilityRepository.findAllByIsActiveTrue().stream()
                .map(f -> FacilityResponseDTO.builder()
                        .id(f.getFacilityId())
                        .name(f.getFacilityName())
                        .address(f.getAddress())
                        .description(f.getDescription())
                        .imageUrl(f.getImageUrl())
                        .build())
                .toList();
    }
    public List<SpecialtyResponseDTO> getAllSpecialties() {
        return specialtyRepository.findAllByIsActiveTrue().stream()
                .map(s -> SpecialtyResponseDTO.builder()
                        .id(s.getSpecialtyId())
                        .name(s.getSpecialtyName())
                        .description(s.getDescription())
                        .build())
                .toList();
    }
    public List<DoctorCardResonseDTO> getDoctors(String name , Integer specialityId, Double minPrice, Double maxPrice) {
        Specification<DoctorDetail> specification = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.equal(root.get("verificationStatus"), DoctorDetail.VerificationStatus.APPROVED));
            if (name != null && !name.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("user").get("fullName")), "%" + name.toLowerCase() + "%"));
            }

            if (specialityId != null) {
                predicates.add(cb.equal(root.get("specialty").get("id"), specialityId));
            }

            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        List <DoctorDetail> doctors = doctorDetailRepository.findAll(specification);
        return doctors.stream().map(doctor -> DoctorCardResonseDTO.builder()
                .doctorName(doctor.getUser().getFullName())
                .specialtyName(doctor.getSpecialty().getSpecialtyName())
                .doctorEmail(doctor.getUser().getEmail())
                .doctorPhone(doctor.getUser().getPhoneNumber())
                .avatarUrl(doctor.getUser().getAvatarUrl())
                .build()
        ).collect(Collectors.toList());
    }

    public DoctorDetailResonseDTO getDoctorById(Integer doctorId){
        DoctorDetail doctor = doctorDetailRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Bác sĩ với ID " + doctorId +" không tồn tại!"));

        if(doctor.getVerificationStatus() != DoctorDetail.VerificationStatus.APPROVED){
            throw new RuntimeException("Thông tin bác sĩ này chưa được công khai!");
        }
        return DoctorDetailResonseDTO.builder()
                .id(doctor.getDoctorId())
                .fullName(doctor.getUser().getFullName())
                .specialtyName(doctor.getSpecialty().getSpecialtyName())
                .price(doctor.getPrice())
                .bio(doctor.getBio())
                .doctorEmail(doctor.getUser().getEmail())
                .doctorPhone(doctor.getUser().getPhoneNumber())
                .avatarUrl(doctor.getUser().getAvatarUrl())
                .ratingAverage(doctor.getRatingAverage())
                .totalReviews(doctor.getReviewCount())
                .build();
    }
    public List<ReviewResponseDTO> getReviewsByDoctorId(Integer doctorId){
        List<Review> reviews = reviewRepository.findByAppointment_Schedule_Doctor_DoctorIdOrderByCreatedAtDesc(doctorId);
        return reviews.stream().map(review -> ReviewResponseDTO.builder()
                .reviewId(review.getReviewId())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .patientName(review.getAppointment().getPatient().getUser().getFullName())
                .build()
        ).collect(Collectors.toList());
    }

    public List<SlotResponseDTO> getAvailableSlots(Integer doctorId, LocalDate dateWorking){
        DoctorDetail doctor = doctorDetailRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Bác sĩ không tồn tại!"));

        if (doctor.getVerificationStatus() != DoctorDetail.VerificationStatus.APPROVED) {
            return new ArrayList<>();
        }
        List<DoctorSchedule> schedules = doctorScheduleRepository.findByDoctor_DoctorIdAndDateWorkingAndSlotStatus(
                doctorId, dateWorking, DoctorSchedule.SlotStatus.AVAILABLE);
        return schedules.stream().map(schedule -> SlotResponseDTO.builder()
                .scheduleId(schedule.getScheduleId())
                .timeSlot(schedule.getTimeSlot().getDisplayValue())
                .slotStatus(schedule.getSlotStatus().name())
                .build()
        ).collect(Collectors.toList());
    }
}
