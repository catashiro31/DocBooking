package docbooking.repositories;

import docbooking.models.PatientProfile;
import docbooking.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientProfileRepository extends JpaRepository<PatientProfile, Integer> {
    boolean existsByFullNameAndPhoneNumberAndUser(String fullName, String phoneNumber, User user);
}
