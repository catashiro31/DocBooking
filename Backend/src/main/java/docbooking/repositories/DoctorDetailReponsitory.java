package docbooking.repositories;

import docbooking.models.DoctorDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface DoctorDetailReponsitory extends JpaRepository<DoctorDetail, Integer>,
                                                 JpaSpecificationExecutor<DoctorDetail>{

}
