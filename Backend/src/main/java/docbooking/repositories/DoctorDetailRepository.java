package docbooking.repositories;

import docbooking.models.DoctorDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorDetailRepository  extends JpaRepository<DoctorDetail, Integer>,
                                                 JpaSpecificationExecutor<DoctorDetail> {
    List<DoctorDetail> findDoctorDetailByVerificationStatus(DoctorDetail.VerificationStatus status);

    DoctorDetail findByDoctorId(long doctorId);
}