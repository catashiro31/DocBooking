package docbooking.repositories;

import docbooking.models.DoctorDetail;
import docbooking.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.lang.Nullable;

@Repository
public interface DoctorDetailRepository  extends JpaRepository<DoctorDetail, Integer>,
                                                 JpaSpecificationExecutor<DoctorDetail> {
    
    @EntityGraph(attributePaths = {"user", "specialty", "facility"})
    Page<DoctorDetail> findAll(@Nullable Specification<DoctorDetail> spec, Pageable pageable);

    @EntityGraph(attributePaths = {"user", "specialty", "facility"})
    Page<DoctorDetail> findAll(Pageable pageable);

    @EntityGraph(attributePaths = {"user", "specialty", "facility"})
    Optional<DoctorDetail> findById(Integer id);

    @EntityGraph(attributePaths = {"user", "specialty", "facility"})
    List<DoctorDetail> findDoctorDetailByVerificationStatus(DoctorDetail.VerificationStatus status);

    @Query("SELECT AVG(COALESCE(d.ratingAverage, 5.0)) FROM DoctorDetail d WHERE d.verificationStatus = :status")
    Double getAverageRatingByVerificationStatus(@Param("status") DoctorDetail.VerificationStatus status);

    @EntityGraph(attributePaths = {"user", "specialty", "facility"})
    DoctorDetail findByDoctorId(Integer doctorId);

    boolean existsByUser(User user);
    Optional<DoctorDetail> findByUser_UserId(Integer userId);

    Optional<DoctorDetail> findByUser(User user);

    long countByVerificationStatus(DoctorDetail.VerificationStatus status);

    long countByVerificationStatusAndUser_IsActiveTrue(DoctorDetail.VerificationStatus status);
}