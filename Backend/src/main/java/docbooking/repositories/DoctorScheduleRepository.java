package docbooking.repositories;

import docbooking.models.DoctorSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import docbooking.models.DoctorSchedule.SlotStatus;
import docbooking.models.DoctorSchedule.TimeSlot;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DoctorScheduleRepository extends JpaRepository<DoctorSchedule,Integer> {
    List<DoctorSchedule> findByDoctor_DoctorIdAndDateWorkingAndSlotStatus(
            Integer doctorId,
            LocalDate dateWorking,
            SlotStatus slotStatus
    );

    boolean existsByDoctor_DoctorIdAndDateWorkingAndTimeSlot(
            Integer doctorId,
            LocalDate dateWorking,
            TimeSlot timeSlot
    );
}
