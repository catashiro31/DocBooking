package docbooking.repositories;

import docbooking.models.Review;
import docbooking.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review,Integer> {
    
    @EntityGraph(attributePaths = {"appointment", "appointment.patient"})
    List<Review> findByAppointment_Schedule_Doctor_DoctorIdAndIsVisibleTrueOrderByCreatedAtDesc(Integer doctorId);

    @EntityGraph(attributePaths = {"appointment", "appointment.patient"})
    Page<Review> findAll(Pageable pageable);

    Optional<Review> findByAppointment_Id(Integer id);
    List<Review> findByAppointment_Schedule_Doctor_DoctorId(Integer doctorId);
    Page<Review> findByAppointment_Schedule_Doctor_UserAndIsVisibleTrueOrderByCreatedAtDesc(User user, Pageable pageable);
}
