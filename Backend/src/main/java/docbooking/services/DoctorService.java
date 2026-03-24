package docbooking.services;

import docbooking.dtos.requests.DoctorProfileRequestDTO;
import docbooking.models.DoctorDetail;
import docbooking.models.Facility;
import docbooking.models.Specialty;
import docbooking.models.User;
import docbooking.repositories.DoctorDetailRepository;
import docbooking.repositories.FacilityRepository;
import docbooking.repositories.SpecialtyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DoctorService {
    private final DoctorDetailRepository doctorDetailRepository;
    private final SpecialtyRepository specialtyRepository;
    private final FacilityRepository facilityRepository;
    @Transactional
    public String completeProfile(User user, DoctorProfileRequestDTO req) {
        if (doctorDetailRepository.existsByUser(user)) {
            throw new RuntimeException("Hồ sơ đã tồn tại, vui lòng đợi duyệt!");
        }

        Specialty specialty = specialtyRepository.findById(req.getSpecialtyId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chuyên khoa"));
        Facility facility = facilityRepository.findById(req.getFacilityId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cơ sở y tế"));

        // Tạo DoctorDetail với đầy đủ các trường bạn vừa gửi
        DoctorDetail doctorDetail = DoctorDetail.builder()
                .user(user)
                .specialty(specialty)
                .facility(facility)
                .bio(req.getBio())
                .degree(req.getDegree())
                .experienceYears(req.getExperienceYears())
                .price(req.getPrice())
                .idCardUrl(req.getIdCardUrl())
                .certificateUrl(req.getCertificateUrl())
                .verificationStatus(DoctorDetail.VerificationStatus.PENDING)
                .ratingAverage(0.0)
                .reviewCount(0)
                .build();

        doctorDetailRepository.save(doctorDetail);
        return "Hồ sơ của bạn đã được gửi đi thành công!";
    }
}
