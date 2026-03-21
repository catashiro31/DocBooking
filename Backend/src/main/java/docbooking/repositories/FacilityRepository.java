package docbooking.repositories;

import docbooking.models.Facility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public  interface FacilityRepository  extends JpaRepository<Facility,Integer> {
    Facility findByFacilityId(long facilityId);
}
