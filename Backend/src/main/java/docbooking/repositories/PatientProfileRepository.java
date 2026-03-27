package docbooking.repositories;

import docbooking.models.PatientProfile;
import docbooking.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PatientProfileRepository extends JpaRepository<PatientProfile, Integer> {
    boolean existsByFullNameAndPhoneNumberAndUserAndIsActiveTrue(String fullName, String phoneNumber, User user);
    boolean existsByFullNameAndPhoneNumberAndUserAndIsActiveTrueAndPatientIdNot(String fullName, String phoneNumber, User user, Integer id);
    Optional<PatientProfile> findByPatientIdAndUserAndIsActiveTrue(Integer id, User user);
    List<PatientProfile> findByUserAndIsActiveTrue(User user);

}
