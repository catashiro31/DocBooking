package docbooking.repositories;

import docbooking.models.Facility;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public  interface FacilityRepository  extends JpaRepository<Facility,Integer> {
    Facility findByFacilityId(Integer facilityId);

    boolean existsByFacilityNameIgnoreCase(String specialtyName);

    boolean existsByFacilityNameIgnoreCaseAndFacilityIdNot(String specialtyName, Integer id);

    List<Facility> findAllByIsActiveTrue();
}
