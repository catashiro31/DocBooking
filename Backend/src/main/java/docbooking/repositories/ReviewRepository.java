package docbooking.repositories;

import docbooking.models.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review,Integer> {
    List<Review> findByAppointment_Schedule_Doctor_DoctorIdOrderByCreatedAtDesc(Integer doctorId);

    Optional<Review> findByAppointment_Id(Integer id);
    List<Review> findByAppointment_Schedule_Doctor_DoctorId(Integer doctorId);
}
