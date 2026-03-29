package docbooking.admin;

import docbooking.admin.requests.Facility;
import docbooking.admin.requests.Specialty;
import docbooking.models.Appointment;
import docbooking.models.DoctorDetail;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;


@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasAnyAuthority('ADMIN')")
public class AdminController {
    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats(
            @RequestParam(value = "startDate", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,

            @RequestParam(value = "endDate", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        // Nếu không truyền, mặc định lấy trong vòng 1 tháng qua
        if (startDate == null) startDate = LocalDate.now().minusMonths(1);
        if (endDate == null) endDate = LocalDate.now();

        return ResponseEntity.ok(adminService.getStats(startDate, endDate));
    }

    @GetMapping("/doctor-pending")
    public ResponseEntity<?> getDoctorPending() {
        return ResponseEntity.ok(adminService.getPendingDoctors());
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveDoctor(@PathVariable Integer id) {
        try {
            DoctorDetail doctor = adminService.approveDoctor(id);
            return  ResponseEntity.ok(doctor);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectDoctor(@PathVariable Integer id, @RequestParam String reason) {
        try {
            DoctorDetail doctor = adminService.rejectDoctor(id, reason);
            return ResponseEntity.ok().body(doctor);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/specialty")
    public ResponseEntity<?> addSpecialty(@Valid @RequestBody Specialty req) {
        return ResponseEntity.ok(adminService.addSpecialty(req));
    }

    @PutMapping("/specialty/{id}")
    public ResponseEntity<?> updateSpecialty(@PathVariable Integer id, @Valid @RequestBody Specialty req) {
        return ResponseEntity.ok(adminService.updateSpecialty(id,req));
    }

    @DeleteMapping("/specialty/{id}")
    public ResponseEntity<?> deleteSpecialty(@PathVariable Integer id) {
        return ResponseEntity.ok(adminService.deleteSpecialty(id));
    }

    @PostMapping("/facility")
    public ResponseEntity<?> addFacility(@Valid @ModelAttribute Facility req) {
        return ResponseEntity.ok(adminService.addFacility(req));
    }

    @PutMapping("/facility/{id}")
    public ResponseEntity<?> updateFacility(@PathVariable Integer id,@Valid @ModelAttribute Facility req) {
        return ResponseEntity.ok(adminService.updateFacility(id, req));
    }

    @DeleteMapping("/facility/{id}")
    public ResponseEntity<?> deleteFacility(@PathVariable Integer id) {
        return ResponseEntity.ok(adminService.deleteFacility(id));
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok().body(adminService.getAllUsers());
    }

    @PatchMapping("/users/{id}/block")
    public ResponseEntity<?> setBlocked(@PathVariable Integer id, @RequestParam String reason) {
        return ResponseEntity.ok().body(adminService.setBlockedUser(id,reason));
    }

    @GetMapping("/appointments")
    public ResponseEntity<?> getAllAppointments(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            @RequestParam(required = false) Appointment.BookingStatus status
    ) {
        if (dateFrom == null) dateFrom = LocalDate.now().minusMonths(1);
        if (dateTo == null) dateTo = LocalDate.now();
        return ResponseEntity.ok().body(adminService.getAllAppointments(
                dateFrom.atStartOfDay(), dateTo.plusDays(1).atStartOfDay(), status));
    }

    @GetMapping("/reviews")
    public ResponseEntity<?> getAllReviews() {
        return ResponseEntity.ok().body(adminService.getAllReviews());
    }

    @PatchMapping("/reviews/{id}/hide")
    public ResponseEntity<?> rejectReview(@PathVariable Integer id) {
        return ResponseEntity.ok().body(adminService.rejectReview(id));
    }
}