package docbooking.doctor;

import docbooking.doctor.requests.Schedule;
import docbooking.doctor.requests.ChangeProfile;
import docbooking.doctor.requests.Profile;
import docbooking.doctor.requests.MedicalResult;
import docbooking.models.Appointment;
import docbooking.models.User;
import docbooking.utils.Security;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/doctor")
@PreAuthorize("hasAnyAuthority('DOCTOR')")
public class DoctorController {
    private final DoctorService doctorService;
    @PostMapping("/profile")
    public ResponseEntity<?> completeProfile(@Valid @ModelAttribute Profile req) {
        User currentUser = Security.getCurrentUser();
        return ResponseEntity.ok(doctorService.completeProfile(currentUser, req));
    }
    @PostMapping("/schedules")
    public ResponseEntity<?> createSchedules(
            @RequestBody Schedule schedule){
        User currentUser = Security.getCurrentUser();
        doctorService.createDoctorSchedule(currentUser.getUserId(), schedule);
        return ResponseEntity.ok("Tạo lịch làm việc thành công!");
    }

    @GetMapping("/schedules")
    public ResponseEntity<?> getShedules(){
        User currentUser = Security.getCurrentUser();

        return ResponseEntity.ok(doctorService.getDoctorSchedules(currentUser.getUserId()));
    }

    @DeleteMapping("/schedules/{id}")
    public ResponseEntity<?> deleteSchedule(@PathVariable Integer id) {
        doctorService.deleteDoctorSchedule(Security.getCurrentUser().getUserId(), id);
        return ResponseEntity.ok("Đã đóng lịch trình thành công!");
    }
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        User currentUser = Security.getCurrentUser();
        return ResponseEntity.ok(doctorService.getDoctorProfile(currentUser));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody ChangeProfile req) {
        User currentUser = Security.getCurrentUser();
        return ResponseEntity.ok(doctorService.updateDoctorProfile(currentUser, req));
    }

    @GetMapping("/reviews")
    public ResponseEntity<?> getReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        User currentUser = Security.getCurrentUser();
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(doctorService.getDoctorReviews(currentUser, pageable));
    }

    @GetMapping("/appointment")
    public ResponseEntity<?> getAppointment(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        User currentUser = Security.getCurrentUser();
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(doctorService.getDoctorAppointment(currentUser, pageable));
    }

    @PutMapping("/appointment/{id}/status")
    public ResponseEntity<?> updateBookStatus(
            @PathVariable Integer id,
            @RequestParam(name = "status") Appointment.BookingStatus newStatus) {
        User currentUser = Security.getCurrentUser();
        doctorService.updateAppointmentStatus(currentUser, id, newStatus);
        return ResponseEntity.ok("Cập nhật trạng thái lịch hẹn thành công!");
    }
    @PostMapping("/appointment/{id}/result")
    public ResponseEntity<?> submitResults(
            @PathVariable Integer id,
            @ModelAttribute MedicalResult req) {
        User currentUser = Security.getCurrentUser();
        return ResponseEntity.ok(doctorService.submitMedicalResult(currentUser,id,req));
    }

    @PutMapping("/appointment/{id}/result")
    public ResponseEntity<?> updateResults(
            @PathVariable Integer id,
            @ModelAttribute MedicalResult req) {
        User currentUser = Security.getCurrentUser();
        return ResponseEntity.ok(doctorService.updateMedicalResult(currentUser,id,req));
    }

    @GetMapping("/appointments/overdue")
    public ResponseEntity<?> getOverdueAppointments() {
        User currentUser = Security.getCurrentUser();
        return ResponseEntity.ok(doctorService.getOverdueConfirmedAppointments(currentUser));
    }
}
