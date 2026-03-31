package docbooking.repositories;

import docbooking.admin.responses.AppointmentStats;
import docbooking.models.Appointment;
import docbooking.models.DoctorSchedule;
import docbooking.models.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

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
    @EntityGraph(attributePaths = {"schedule", "patient", "schedule.doctor"})
    Page<Appointment> findAllByPeriodAndStatus(
            @Param("dateFrom") LocalDateTime dateFrom,
            @Param("dateTo") LocalDateTime dateTo,
            @Param("status") Appointment.BookingStatus status,
            Pageable pageable
    );

    @EntityGraph(attributePaths = {"schedule", "schedule.doctor", "schedule.doctor.specialty", "schedule.doctor.facility"})
    Page<Appointment> findByPatient_UserOrderByCreatedAtDesc(User user, Pageable pageable);

    @EntityGraph(attributePaths = {"schedule", "schedule.doctor", "schedule.doctor.specialty", "schedule.doctor.facility"})
    Page<Appointment> findByPatient_UserAndBookingStatusOrderBySchedule_DateWorkingDesc(
            User user, Appointment.BookingStatus status, Pageable pageable
    );

    @EntityGraph(attributePaths = {"schedule", "patient"})
    Page<Appointment> findBySchedule_Doctor_UserOrderBySchedule_DateWorkingDescSchedule_TimeSlotAsc(User user, Pageable pageable);


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
            "AND a.bookingStatus = 'PENDING'")
    List<Appointment> findPastDueAppointments(@Param("today") LocalDate today);

    @Query("SELECT a FROM Appointment a JOIN a.schedule s " +
            "WHERE s.dateWorking < :today " +
            "AND a.bookingStatus = 'CONFIRMED'")
    List<Appointment> findOverdueConfirmedAppointments(@Param("today") LocalDate today);

    @Query("SELECT a FROM Appointment a JOIN a.schedule s " +
            "WHERE s.doctor.user.userId = :doctorUserId " +
            "AND s.dateWorking < :today " +
            "AND a.bookingStatus = 'CONFIRMED'")
    List<Appointment> findOverdueConfirmedByDoctorUserId(
            @Param("doctorUserId") Integer doctorUserId,
            @Param("today") LocalDate today);

    long countByPatient_User_UserIdAndBookingStatusIn(
            Integer userId,
            Collection<Appointment.BookingStatus> statuses
    );
    long countByPatient_User_UserIdAndBookingStatus(
            Integer userId,
            Appointment.BookingStatus status
    );

    @Query("SELECT COUNT(a) FROM Appointment a " +
            "WHERE a.patient.user.userId = :userId " +
            "AND a.bookingStatus = :status " +
            "AND a.schedule.dateWorking >= :fromDate")
    long countNoShowInPeriod(
            @Param("userId") Integer userId,
            @Param("status") Appointment.BookingStatus status,
            @Param("fromDate") LocalDate fromDate
    );

    List<Appointment> findBySchedule_Doctor_User_UserIdAndBookingStatusIn(
            Integer userId,
            Collection<Appointment.BookingStatus> statuses
    );
}
