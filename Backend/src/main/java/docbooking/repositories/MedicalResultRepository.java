package docbooking.repositories;

import docbooking.models.MedicalResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface MedicalResultRepository extends JpaRepository<MedicalResult, Integer> {
    Optional<MedicalResult> findByAppointmentId (Integer id);
}
