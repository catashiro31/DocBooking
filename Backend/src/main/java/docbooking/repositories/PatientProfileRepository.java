package docbooking.repositories;

import docbooking.dtos.responses.RelativeResponseDTO;
import docbooking.models.PatientProfile;
import docbooking.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PatientProfileRepository extends JpaRepository<PatientProfile, Integer> {
    boolean existsByFullNameAndPhoneNumberAndUser(String fullName, String phoneNumber, User user);
    boolean existsByFullNameAndPhoneNumberAndUserAndPatientIdNot(String fullName, String phoneNumber, User user, Integer id);
    Optional<PatientProfile> findByPatientIdAndUser(Integer id, User user);
    List<PatientProfile> findByUser(User user);
    boolean existsByFullNameAndPhoneNumberAndUserAndIsActiveTrue(String fullName, String phoneNumber, User user);
    boolean existsByFullNameAndPhoneNumberAndUserAndIsActiveTrueAndPatientIdNot(String fullName, String phoneNumber, User user, Integer id);
    Optional<PatientProfile> findByPatientIdAndUserAndIsActiveTrue(Integer id, User user);
    List<PatientProfile> findByUserAndIsActiveTrue(User user);

}
