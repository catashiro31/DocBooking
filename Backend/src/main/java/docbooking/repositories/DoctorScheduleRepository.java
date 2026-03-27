package docbooking.repositories;

import docbooking.models.DoctorSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import docbooking.models.DoctorSchedule.SlotStatus;
import docbooking.models.DoctorSchedule.TimeSlot;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorScheduleRepository extends JpaRepository<DoctorSchedule,Integer> {
    List<DoctorSchedule> findByDoctor_DoctorIdAndDateWorkingAndSlotStatus(
            Integer doctorId,
            LocalDate dateWorking,
            SlotStatus slotStatus
    );

    @Modifying
    @Query("UPDATE DoctorSchedule s SET s.slotStatus = 'CLOSED' WHERE s.scheduleId = :id")
    void deleteSchedule(@Param("id") Integer id);
    boolean existsByDoctor_DoctorIdAndDateWorkingAndTimeSlot(
            Integer doctorId,
            LocalDate dateWorking,
            TimeSlot timeSlot
    );
    List<DoctorSchedule> findByDoctor_DoctorIdOrderByDateWorkingDesc(Integer doctorId);

    Optional<DoctorSchedule> findByDoctor_DoctorIdAndDateWorkingAndTimeSlot(
            Integer doctorId,
            LocalDate dateWorking,
            DoctorSchedule.TimeSlot timeSlot
    );
}
