package docbooking.repositories;

import docbooking.models.DoctorDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DoctorDetailRepository  extends JpaRepository<DoctorDetail, Integer> {

}
