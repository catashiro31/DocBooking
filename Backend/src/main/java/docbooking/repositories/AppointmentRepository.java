package docbooking.repositories;

import docbooking.dtos.AppointmentStats;
import docbooking.models.Appointment;
import docbooking.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {

    @Query("SELECT new docbooking.dtos.AppointmentStats( " +
            "COUNT(CASE WHEN a.bookingStatus = 'COMPLETED' THEN 1 END), " +
            "COUNT(CASE WHEN a.bookingStatus = 'PENDING' THEN 1 END), " +
            "COUNT(CASE WHEN a.bookingStatus = 'CANCELLED' THEN 1 END)) " +
            "FROM Appointment a " +
            "WHERE a.createdAt BETWEEN :start AND :end")
    AppointmentStats getAppointmentStatsByPeriod(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
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
}
