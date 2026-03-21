package docbooking.services;

import docbooking.dtos.responses.DoctorCardDTO;
import docbooking.dtos.responses.DoctorDetailDTO;
import docbooking.dtos.responses.ReviewDTO;
import docbooking.dtos.responses.SlotResponDTO;
import docbooking.models.DoctorDetail;
import docbooking.models.DoctorSchedule;
import docbooking.models.Review;
import docbooking.repositories.DoctorDetailReponsitory;
import docbooking.repositories.DoctorScheduleRepository;
import docbooking.repositories.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.criteria.Predicate;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class DoctorService {
    private final DoctorScheduleRepository doctorScheduleRepository;
    private final DoctorDetailReponsitory doctorDetailReponsitory;
    private final ReviewRepository reviewRepository;

    public List<DoctorCardDTO> getDoctors(String name , Integer specialityId, Double minPrice, Double maxPrice) {
        Specification<DoctorDetail> specification = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

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
        List <DoctorDetail> doctors = doctorDetailReponsitory.findAll(specification);
        return doctors.stream().map(doctor ->{
            return DoctorCardDTO.builder()
                    .doctorName(doctor.getUser().getFullName())
                    .specialtyName(doctor.getSpecialty().getSpecialityName())
                    .doctorEmail(doctor.getUser().getEmail())
                    .doctorPhone(doctor.getUser().getPhoneNumber())
                    .avatarUrl(doctor.getUser().getAvatarUrl())
                    .build();
        }).collect(Collectors.toList());
    }

    public DoctorDetailDTO getDoctorById(Integer doctorId){
        DoctorDetail doctor = doctorDetailReponsitory.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Bác sĩ với ID " + doctorId +" không tồn tại!"));
        return DoctorDetailDTO.builder()
                .id(doctor.getDoctorId())
                .fullName(doctor.getUser().getFullName())
                .specialtyName(doctor.getSpecialty().getSpecialityName())
                .price(doctor.getPrice())
                .description(doctor.getBio())
                .doctorEmail(doctor.getUser().getEmail())
                .doctorPhone(doctor.getUser().getPhoneNumber())
                .avatarUrl(doctor.getUser().getAvatarUrl())
                .ratingAverage(doctor.getRatingAverage())
                .totalReviews(doctor.getReviewCount())
                .build();
    }
    public List<ReviewDTO> getReviewsByDoctorId(Integer doctorId){
        List<Review> reviews = reviewRepository.findByAppointment_Schedule_Doctor_DoctorIdOrderByCreatedAtDesc(doctorId);
        return reviews.stream().map(review -> ReviewDTO.builder()
                .reviewId(review.getReviewId())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .patientName(review.getAppointment().getPatient().getUser().getFullName())
                .build()
        ).collect(Collectors.toList());
    }

    public List<SlotResponDTO> getAvailableSlots(Integer doctorId, LocalDate dateWorking){
        List<DoctorSchedule> schedules = doctorScheduleRepository.findByDoctor_DoctorIdAndDateWorkingAndSlotStatus(
                doctorId, dateWorking, DoctorSchedule.SlotStatus.AVAILABLE);
        return schedules.stream().map(schedule -> SlotResponDTO.builder()
                .scheduleId(schedule.getScheduleId())
                .timeSlot(schedule.getTimeSlot().getDisplayValue())
                .slotStatus(schedule.getSlotStatus().name())
                .build()
        ).collect(Collectors.toList());
    }
}
