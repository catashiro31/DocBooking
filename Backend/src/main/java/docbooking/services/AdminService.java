package docbooking.services;

import docbooking.dtos.responses.StatResponseDTO;
import docbooking.models.Appointment;
import docbooking.models.DoctorDetail;
import docbooking.models.User;
import docbooking.repositories.AppointmentRepository;
import docbooking.repositories.DoctorDetailRepository;
import docbooking.repositories.PatientProfileRepository;
import docbooking.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService {
    private final DoctorDetailRepository doctorDetail;
    private final PatientProfileRepository patientProfile;
    private final AppointmentRepository appointment;
    private final UserRepository userRepository;

    public AdminService(DoctorDetailRepository doctorDetail, PatientProfileRepository patientProfile, AppointmentRepository appointment, UserRepository userRepository) {
        this.doctorDetail = doctorDetail;
        this.patientProfile = patientProfile;
        this.appointment = appointment;
        this.userRepository = userRepository;
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

    public List<DoctorDetail> getPendingDoctors() {
        return doctorDetail.findDoctorDetailByVerificationStatus(DoctorDetail.VerificationStatus.PENDING);
    }

    public DoctorDetail approveDoctor(long doctorId) {
        DoctorDetail doctor = doctorDetail.findByDoctorId(doctorId);
        doctor.setVerificationStatus(DoctorDetail.VerificationStatus.APPROVED);
        doctorDetail.save(doctor);
        return doctor;
    }

    public DoctorDetail rejectDoctor(long doctorId, String reason) {
        DoctorDetail doctor = doctorDetail.findByDoctorId(doctorId);
        doctor.setVerificationStatus(DoctorDetail.VerificationStatus.REJECTED);
        doctor.setReasonReject(reason);
        doctorDetail.save(doctor);
        return doctor;
    }

    public List<User> getAllUsers() {
        return userRepository.getAllUsers();
    }

    public User setBlockedUser(long userId, String reason) {
        User user = userRepository.findByUserId(userId);
        user.setIsActive(false);
        user.setReasonBanned(reason);
        userRepository.save(user);
        return user;
    }
}
