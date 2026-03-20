package docbooking.services;

import docbooking.dtos.requests.RelativeRequestDTO;
import docbooking.dtos.responses.RelativeResponseDTO;
import docbooking.models.PatientProfile;
import docbooking.models.User;
import docbooking.repositories.PatientProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PatientProfileService {
    private final PatientProfileRepository patientProfileRepository;
    public RelativeResponseDTO addRelative(User user, RelativeRequestDTO req){
        if (patientProfileRepository.existsByFullNameAndPhoneNumberAndUser(
                req.getFullName(), req.getPhoneNumber(), user)) {
            throw new RuntimeException("Người thân này đã có trong danh sách rồi baby ơi!");
        }
        PatientProfile profile = PatientProfile.builder()
                .fullName(req.getFullName())
                .dateOfBirth(req.getDateOfBirth())
                .gender(req.getGender())
                .phoneNumber(req.getPhoneNumber())
                .address(req.getAddress())
                .relationship(req.getRelationship())
                .user(user)
                .build();
        return mapToResponseDTO(patientProfileRepository.save(profile));
    }
    public RelativeResponseDTO mapToResponseDTO(PatientProfile p) {
        return RelativeResponseDTO.builder()
                .patientId(p.getPatientId())
                .fullName(p.getFullName())
                .dateOfBirth(p.getDateOfBirth())
                .gender(p.getGender().name())
                .phoneNumber(p.getPhoneNumber())
                .address(p.getAddress())
                .relationship(p.getRelationship())
                .build();
    }
}
