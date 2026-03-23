package docbooking.repositories;

import docbooking.models.Specialty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SpecialtyRepository extends JpaRepository<Specialty, Integer> {
    Specialty  findBySpecialtyId(Integer id);
}
