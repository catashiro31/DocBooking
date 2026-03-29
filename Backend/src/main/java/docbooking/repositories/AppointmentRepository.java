package docbooking.repositories;

import docbooking.admin.responses.AppointmentStats;
import docbooking.models.Appointment;
import docbooking.models.DoctorSchedule;
import docbooking.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {

    @Query("SELECT new docbooking.admin.responses.AppointmentStats( " +
            "COUNT(CASE WHEN a.bookingStatus = 'COMPLETED' THEN 1 END), " +
            "COUNT(CASE WHEN a.bookingStatus IN('PENDING', 'CONFIRMED') THEN 1 END), " +
            "COUNT(CASE WHEN a.bookingStatus = 'CANCELLED' THEN 1 END)) " +
            "FROM Appointment a JOIN a.schedule s " +
            "WHERE s.dateWorking BETWEEN :start AND :end")
    AppointmentStats getAppointmentStatsByPeriod(
            @Param("start") LocalDate start,
            @Param("end") LocalDate end
    );

    @Query("SELECT a FROM Appointment a " +
            "WHERE a.createdAt BETWEEN :dateFrom AND :dateTo " +
            "AND (:status IS NULL OR a.bookingStatus = :status) " +
            "ORDER BY a.createdAt DESC")
    List<Appointment> findAllByPeriodAndStatus(
            @Param("dateFrom") LocalDateTime dateFrom,
            @Param("dateTo") LocalDateTime dateTo,
            @Param("status") Appointment.BookingStatus status
    );

    List<Appointment> findByPatient_UserOrderByCreatedAtDesc(User user);

    List<Appointment> findByPatient_UserAndBookingStatusOrderBySchedule_DateWorkingDesc(
            User user, Appointment.BookingStatus status
    );

    List<Appointment> findBySchedule_Doctor_UserOrderBySchedule_DateWorkingDescSchedule_TimeSlotAsc(User user);


    boolean existsByPatient_PatientIdAndBookingStatusIn(
            Integer patientId,
            Collection<Appointment.BookingStatus> statuses
    );

    List<Appointment> findByPatient_User_UserIdAndBookingStatusIn(
            Integer userId,
            Collection<Appointment.BookingStatus> statuses
    );



    @Query("SELECT COUNT(a) > 0 FROM Appointment a " +
            "WHERE a.patient.patientId = :patientId " +
            "AND a.schedule.dateWorking = :date " +
            "AND a.schedule.timeSlot = :timeSlot " +
            "AND a.bookingStatus IN ('PENDING', 'CONFIRMED')")
    boolean existsOverlappingAppointment(@Param("patientId") Integer patientId,
                                         @Param("date") LocalDate date,
                                         @Param("timeSlot") DoctorSchedule.TimeSlot timeSlot);


    @Query("SELECT a FROM Appointment a JOIN a.schedule s " +
            "WHERE s.dateWorking < :today " +
            "AND a.bookingStatus IN ('PENDING', 'CONFIRMED')")
    List<Appointment> findPastDueAppointments(@Param("today") LocalDate today);

    long countByPatient_User_UserIdAndBookingStatusIn(
            Integer userId,
            Collection<Appointment.BookingStatus> statuses
    );
    long countByPatient_User_UserIdAndBookingStatus(
            Integer userId,
            Appointment.BookingStatus status
    );

}
