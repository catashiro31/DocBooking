package docbooking.repositories;

import docbooking.models.DoctorSchedule;
import docbooking.models.DoctorSchedule.SlotStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorScheduleRepository extends JpaRepository<DoctorSchedule, Integer> {

    List<DoctorSchedule> findByDoctor_DoctorIdAndDateWorkingAndSlotStatus(
            Integer doctorId,
            LocalDate dateWorking,
            SlotStatus slotStatus
    );

    @Modifying
    @Transactional
    @Query("UPDATE DoctorSchedule s SET s.slotStatus = 'CLOSED' WHERE s.scheduleId = :id")
    void deleteSchedule(@Param("id") Integer id);

    List<DoctorSchedule> findByDoctor_DoctorIdOrderByDateWorkingDesc(Integer doctorId);

    Optional<DoctorSchedule> findByDoctor_DoctorIdAndDateWorkingAndTimeSlot(
            Integer doctorId,
            LocalDate dateWorking,
            DoctorSchedule.TimeSlot timeSlot
    );

    List<DoctorSchedule> findByDateWorkingAndSlotStatus(LocalDate date, SlotStatus status);

    @Modifying
    @Transactional
    @Query("UPDATE DoctorSchedule s SET s.slotStatus = 'CLOSED' " +
            "WHERE s.dateWorking < :today AND s.slotStatus = 'AVAILABLE'")
    void closePastDaysSlots(@Param("today") LocalDate today);

    @Modifying
    @Transactional
    @Query("UPDATE DoctorSchedule s SET s.slotStatus = 'CLOSED' " +
            "WHERE s.doctor.user.userId = :userId AND s.slotStatus = 'AVAILABLE'")
    void closeAllAvailableSlotsByDoctorUserId(@Param("userId") Integer userId);

    @Modifying
    @Transactional
    @Query("UPDATE DoctorSchedule s SET s.slotStatus = 'CLOSED' " +
            "WHERE s.doctor.doctorId = :doctorId AND s.dateWorking >= :today AND s.slotStatus = 'AVAILABLE'")
    void closeFutureAvailableSchedulesByDoctorId(@Param("doctorId") Integer doctorId, @Param("today") LocalDate today);

    @Modifying
    @Transactional
    @Query("UPDATE DoctorSchedule s SET s.facility = (SELECT d.facility FROM DoctorDetail d WHERE d.doctorId = s.doctor.doctorId) WHERE s.facility IS NULL")
    void updateMissingFacilities();
}
