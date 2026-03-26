package docbooking.services;

import docbooking.dtos.requests.RelativeRequestDTO;
import docbooking.dtos.responses.RelativeResponseDTO;
import docbooking.models.PatientProfile;
import docbooking.models.User;
import docbooking.repositories.PatientProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PatientProfileService {
    private final PatientProfileRepository patientProfileRepository;
    public RelativeResponseDTO addRelative(User user, RelativeRequestDTO req){
        if (patientProfileRepository.existsByFullNameAndPhoneNumberAndUserAndIsActiveTrue(
                req.getFullName(), req.getPhoneNumber(), user)) {
            throw new RuntimeException("Người thân này đã có trong danh sách rồi");
        }
        PatientProfile profile = PatientProfile.builder()
                .fullName(req.getFullName())
                .dateOfBirth(req.getDateOfBirth())
                .gender(req.getGender())
                .phoneNumber(req.getPhoneNumber())
                .address(req.getAddress())
                .relationship(req.getRelationship())
                .user(user)
                .isActive(true)
                .build();
        return mapToResponseDTO(patientProfileRepository.save(profile));
    }
    public RelativeResponseDTO mapToResponseDTO(PatientProfile p) {
        return RelativeResponseDTO.builder()
                .patientId(p.getPatientId())
                .fullName(p.getFullName())
                .dateOfBirth(p.getDateOfBirth())
                .gender(p.getGender()!= null ? p.getGender().name() : null)
                .phoneNumber(p.getPhoneNumber())
                .address(p.getAddress())
                .relationship(p.getRelationship())
                .build();
    }
    public RelativeResponseDTO getRelativeById(Integer id, User user) {
        PatientProfile profile = patientProfileRepository.findByPatientIdAndUserAndIsActiveTrue(id, user)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người thân hoặc bạn không có quyền xem hồ sơ này!"));
        return mapToResponseDTO(profile);
    }
    public List<RelativeResponseDTO> getMyRelatives(User user) {
        List<PatientProfile> profiles = patientProfileRepository.findByUserAndIsActiveTrue(user);
        return profiles.stream()
                .map(this::mapToResponseDTO)
                .toList();
    }
    public RelativeResponseDTO updateRelative(Integer id, User user, RelativeRequestDTO req) {
        PatientProfile profile = patientProfileRepository.findByPatientIdAndUserAndIsActiveTrue(id, user)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người thân hoặc bạn không có quyền xem hồ sơ này!"));

        String newName = (req.getFullName() != null) ? req.getFullName() : profile.getFullName();
        String newNumber = (req.getPhoneNumber() != null) ? req.getPhoneNumber() : profile.getPhoneNumber();
        if (patientProfileRepository.existsByFullNameAndPhoneNumberAndUserAndIsActiveTrueAndPatientIdNot(
                newName, newNumber, user, id)) {
            throw new RuntimeException("Thông tin này bị trùng với một người thân khác trong danh sách của bạn, đổi thông tin thất bại");
        }
        if (req.getFullName() != null) profile.setFullName(req.getFullName());
        if (req.getDateOfBirth() != null) profile.setDateOfBirth(req.getDateOfBirth());
        if (req.getGender() != null) profile.setGender(req.getGender());
        if (req.getPhoneNumber() != null) profile.setPhoneNumber(req.getPhoneNumber());
        if (req.getAddress() != null) profile.setAddress(req.getAddress());
        if (req.getRelationship() != null) profile.setRelationship(req.getRelationship());

        return mapToResponseDTO(patientProfileRepository.save(profile));
    }

    @Transactional
    public void deleteRelative(User user, Integer id) {
        PatientProfile profile = patientProfileRepository.findByPatientIdAndUserAndIsActiveTrue(id, user)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ hoặc hồ sơ đã bị xóa!"));
        if ("SELF".equals(profile.getRelationship())) {
            throw new RuntimeException("Không thể xóa hồ sơ chính!");
        }
        profile.setIsActive(false);
        patientProfileRepository.save(profile);
    }
}
