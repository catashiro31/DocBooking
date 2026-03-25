package docbooking.repositories;

import docbooking.models.MedicalResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MedicalResultRepository extends JpaRepository<MedicalResult, Integer> {
    Optional<MedicalResult> findByAppointmentId (Integer id);
}
