package docbooking.services;

import com.cloudinary.utils.ObjectUtils;
import docbooking.dtos.requests.FacilityRequestDTO;
import docbooking.dtos.requests.SpecialtyRequestDTO;
import docbooking.dtos.responses.StatResponseDTO;
import docbooking.models.*;
import docbooking.repositories.*;
import docbooking.utils.HandlingFile;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class AdminService {
    private final DoctorDetailRepository doctorDetail;
    private final PatientProfileRepository patientProfile;
    private final AppointmentRepository appointment;
    private final UserRepository userRepository;
    private final SpecialtyRepository specialtyRepository;
    private final FacilityRepository facilityRepository;
    private final HandlingFile handlingFile;

    public AdminService(DoctorDetailRepository doctorDetail, PatientProfileRepository patientProfile, AppointmentRepository appointment, UserRepository userRepository, SpecialtyRepository specialtyRepository, FacilityRepository facilityRepository, HandlingFile handlingFile) {
        this.doctorDetail = doctorDetail;
        this.patientProfile = patientProfile;
        this.appointment = appointment;
        this.userRepository = userRepository;
        this.specialtyRepository = specialtyRepository;
        this.facilityRepository = facilityRepository;
        this.handlingFile = handlingFile;
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

    public DoctorDetail approveDoctor(Integer doctorId) {
        DoctorDetail doctor = doctorDetail.findByDoctorId(doctorId);
        doctor.setVerificationStatus(DoctorDetail.VerificationStatus.APPROVED);
        doctorDetail.save(doctor);
        return doctor;
    }

    public DoctorDetail rejectDoctor(Integer doctorId, String reason) {
        DoctorDetail doctor = doctorDetail.findByDoctorId(doctorId);
        doctor.setVerificationStatus(DoctorDetail.VerificationStatus.REJECTED);
        doctor.setReasonReject(reason);
        doctorDetail.save(doctor);
        return doctor;
    }

    public List<User> getAllUsers() {
        return userRepository.getAllUsers();
    }

    public User setBlockedUser(Integer userId, String reason) {
        User user = userRepository.findByUserId(userId);
        user.setIsActive(false);
        user.setReasonBanned(reason);
        userRepository.save(user);
        return user;
    }

    public Specialty addSpecialty(SpecialtyRequestDTO req) {
        Specialty specialty = Specialty.builder()
                .specialtyName(req.getSpecialtyName())
                .description(req.getDescription())
                .build();
        return specialtyRepository.save(specialty);
    }

    public Specialty updateSpecialty(Integer specialtyId, SpecialtyRequestDTO req) {
        Specialty specialty = specialtyRepository.findBySpecialtyId(specialtyId);
        specialty.setDescription(req.getDescription());
        specialty.setSpecialtyName(req.getSpecialtyName());
        return  specialtyRepository.save(specialty);
    }

    public String deleteSpecialty(Integer specialtyId) {
        try {
            Specialty specialty = specialtyRepository.findBySpecialtyId(specialtyId);
            specialtyRepository.delete(specialty);
            return "Đã xóa chuyên ngành!";
        } catch (Exception e) {
            return e.getMessage();
        }
    }

    public Facility addFacility(FacilityRequestDTO req) {

        Facility facility = Facility.builder()
                .address(req.getAddress())
                .description(req.getDescription())
                .facilityName(req.getFacilityName())
                .imageUrl(handlingFile.getUrlFile(req.getFile()))
                .build();
        return facilityRepository.save(facility);
    }

    public Facility updateFacility(Integer facilityId, FacilityRequestDTO req) {
        Facility facility = facilityRepository.findByFacilityId(facilityId);
        facility.setAddress(req.getAddress());
        facility.setFacilityName(req.getFacilityName());
        facility.setDescription(req.getDescription());
        facility.setImageUrl(handlingFile.getUrlFile(req.getFile()));
        return facilityRepository.save(facility);
    }

    public String deleteFacility(Integer facilityId) {
        try {
            Facility facility = facilityRepository.findByFacilityId(facilityId);
            facilityRepository.delete(facility);
            return "Đã xóa thành công cơ sở!";
        } catch (Exception e) {
            return e.getMessage();
        }
    }

}
