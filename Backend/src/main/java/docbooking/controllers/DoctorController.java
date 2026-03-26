package docbooking.controllers;

import docbooking.dtos.requests.ChangeDoctorProfileRequestDTO;
import docbooking.dtos.requests.DoctorProfileRequestDTO;
import docbooking.models.User;
import docbooking.security.SecurityUtils;
import docbooking.services.DoctorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import docbooking.dtos.requests.BulkScheduleRequestDTO;
import docbooking.models.User;
import docbooking.security.SecurityUtils;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/doctor")
@PreAuthorize("hasAnyAuthority('DOCTOR')")
public class DoctorController {
    private final DoctorService doctorService;
    @PostMapping("/profile")
    public ResponseEntity<?> completeProfile(@Valid @ModelAttribute DoctorProfileRequestDTO req) {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(doctorService.completeProfile(currentUser, req));
    }
    @PostMapping("/schedules")
    public ResponseEntity<?> createSchedules(
            @RequestBody BulkScheduleRequestDTO bulkScheduleRequestDTO){
        User currentUser = SecurityUtils.getCurrentUser(); 
        doctorService.createDoctorSchedule(currentUser.getUserId(), bulkScheduleRequestDTO);
        return ResponseEntity.ok("Tạo lịch làm việc thành công!");
    }

    @GetMapping("/schedules")
    public ResponseEntity<?> getShedules(){
        User currentUser = SecurityUtils.getCurrentUser();

        return ResponseEntity.ok(doctorService.getDoctorSchedules(currentUser.getUserId()));
    }

    @DeleteMapping("/schedules/{id}")
    public ResponseEntity<?> deleteSchedule(@PathVariable Integer id) {
        doctorService.deleteDoctorSchedule(SecurityUtils.getCurrentUser().getUserId(), id);
        return ResponseEntity.ok("Đã đóng lịch trình thành công!");
    }
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(doctorService.getDoctorProfile(currentUser));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody ChangeDoctorProfileRequestDTO req) {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(doctorService.updateDoctorProfile(currentUser, req));
    }

    @GetMapping("/reviews")
    public ResponseEntity<?> getReviews() {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(doctorService.getDoctorReviews(currentUser.getUserId()));
    }
}
