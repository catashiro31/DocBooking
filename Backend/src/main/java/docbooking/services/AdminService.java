package docbooking.services;

import docbooking.dtos.requests.SpecialtyRequestDTO;
import docbooking.dtos.responses.StatResponseDTO;
import docbooking.models.Appointment;
import docbooking.models.DoctorDetail;
import docbooking.models.Specialty;
import docbooking.models.User;
import docbooking.repositories.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {
    private final DoctorDetailRepository doctorDetail;
    private final PatientProfileRepository patientProfile;
    private final AppointmentRepository appointment;
    private final UserRepository userRepository;
    private final SpecialtyRepository specialtyRepository;

    public AdminService(DoctorDetailRepository doctorDetail, PatientProfileRepository patientProfile, AppointmentRepository appointment, UserRepository userRepository, SpecialtyRepository specialtyRepository) {
        this.doctorDetail = doctorDetail;
        this.patientProfile = patientProfile;
        this.appointment = appointment;
        this.userRepository = userRepository;
        this.specialtyRepository = specialtyRepository;
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

    public Specialty addSpecialty(SpecialtyRequestDTO req) {
        Specialty specialty = Specialty.builder()
                .specialName(req.getSpecialName())
                .description(req.getDescription())
                .imageUrl(req.getImageUrl())
                .build();
        return specialtyRepository.save(specialty);
    }

    public Specialty updateSpecialty(long specialtyId, SpecialtyRequestDTO req) {
        Specialty specialty = specialtyRepository.findBySpecialtyId(specialtyId);
        specialty.setDescription(req.getDescription());
        specialty.setImageUrl(req.getImageUrl());
        specialty.setSpecialName(req.getSpecialName());
        return  specialtyRepository.save(specialty);
    }

    public String deleteSpecialty(long specialtyId) {
        try {
            Specialty specialty = specialtyRepository.findBySpecialtyId(specialtyId);
            specialtyRepository.delete(specialty);
            return "Đã xóa chuyên ngành!";
        } catch (Exception e) {
            return e.getMessage();
        }
    }
}
