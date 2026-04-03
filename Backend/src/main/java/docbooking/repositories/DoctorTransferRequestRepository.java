package docbooking.repositories;

import docbooking.models.DoctorTransferRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DoctorTransferRequestRepository extends JpaRepository<DoctorTransferRequest, Integer> {
    
    Page<DoctorTransferRequest> findByStatusOrderByCreatedAtDesc(DoctorTransferRequest.Status status, Pageable pageable);
    
    Optional<DoctorTransferRequest> findFirstByDoctor_DoctorIdAndStatusOrderByCreatedAtDesc(Integer doctorId, DoctorTransferRequest.Status status);
}
