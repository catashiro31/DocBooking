package docbooking.repositories;

import docbooking.models.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment,Integer> {

    long countByBookingStatus(Appointment.BookingStatus bookingStatus);
}
