package docbooking.services;

import docbooking.dtos.responses.StatResponseDTO;
import docbooking.models.Appointment;
import docbooking.models.DoctorDetail;
import docbooking.models.PatientProfile;
import docbooking.repositories.AppointmentRepository;
import docbooking.repositories.DoctorDetailRepository;
import docbooking.repositories.PatientProfileRepository;
import org.springframework.stereotype.Service;

@Service
public class AdminService {
    private final DoctorDetailRepository doctorDetail;
    private final PatientProfileRepository patientProfile;
    private final AppointmentRepository appointment;
    public AdminService(DoctorDetailRepository doctorDetail, PatientProfileRepository patientProfile, AppointmentRepository appointment) {
        this.doctorDetail = doctorDetail;
        this.patientProfile = patientProfile;
        this.appointment = appointment;
    }

    public StatResponseDTO getStats() {
        return StatResponseDTO.builder()
                .numberOfDoctors(doctorDetail.count())
                .numberOfPatients(patientProfile.count())
                .numberOfSuccessAppointments(appointment.countByBookingStatus(Appointment.BookingStatus.COMPLETED))
                .numberOfPendingAppointments(appointment.countByBookingStatus(Appointment.BookingStatus.PENDING))
                .numberOfFailingAppointments(appointment.countByBookingStatus(Appointment.BookingStatus.CANCELLED))
                .build();
    }
}
