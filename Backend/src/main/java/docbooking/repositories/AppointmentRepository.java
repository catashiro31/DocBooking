package docbooking.repositories;

import docbooking.models.Appointment;
import docbooking.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment,Integer> {

    long countByBookingStatus(Appointment.BookingStatus bookingStatus);

    List<Appointment> findByPatient_UserOrderByCreatedAtDesc(User user);

    List<Appointment> findByPatient_UserAndBookingStatusOrderBySchedule_DateWorkingDesc(
            User user, Appointment.BookingStatus status
    );
}
