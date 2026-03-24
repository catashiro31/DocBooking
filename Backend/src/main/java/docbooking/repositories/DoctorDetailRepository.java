package docbooking.repositories;

import docbooking.models.DoctorDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorDetailRepository  extends JpaRepository<DoctorDetail, Integer>,
                                                 JpaSpecificationExecutor<DoctorDetail> {
    List<DoctorDetail> findDoctorDetailByVerificationStatus(DoctorDetail.VerificationStatus status);

    DoctorDetail findByDoctorId(Integer doctorId);
    Optional<DoctorDetail> findByUser_UserId(Integer userId);
}