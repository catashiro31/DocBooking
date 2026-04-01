package docbooking.admin;

import docbooking.admin.requests.Facility;
import docbooking.admin.requests.Specialty;
import docbooking.admin.responses.ReviewAdminResponse;
import docbooking.models.Appointment;
import docbooking.models.DoctorDetail;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;


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

    @GetMapping("/doctor-all")
    public ResponseEntity<?> getAllDoctors(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("doctorId").descending());
        return ResponseEntity.ok(adminService.getAllDoctors(pageable));
    }

    @GetMapping("/doctor/{id}")
    public ResponseEntity<?> getDoctorDetail(@PathVariable Integer id) {
        return ResponseEntity.ok(adminService.getDoctorDetail(id));
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

    @PatchMapping("/facility/{id}/verify")
    public ResponseEntity<?> verifyFacility(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(adminService.verifyFacility(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/facility/{id}")
    public ResponseEntity<?> deleteFacility(@PathVariable Integer id) {
        return ResponseEntity.ok(adminService.deleteFacility(id));
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok().body(adminService.getAllUsers(pageable));
    }

    @PatchMapping("/users/{id}/block")
    public ResponseEntity<?> setBlocked(@PathVariable Integer id, @RequestParam String reason) {
        return ResponseEntity.ok().body(adminService.setBlockedUser(id,reason));
    }

    @PatchMapping("/users/{id}/unblock")
    public ResponseEntity<?> setUnblocked(@PathVariable Integer id) {
        return ResponseEntity.ok().body(adminService.unblockUser(id));
    }

    @GetMapping("/appointments")
    public ResponseEntity<?> getAllAppointments(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            @RequestParam(required = false) Appointment.BookingStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        if (dateFrom == null) dateFrom = LocalDate.now().minusMonths(1);
        if (dateTo == null) dateTo = LocalDate.now();
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok().body(adminService.getAllAppointments(
                dateFrom.atStartOfDay(), dateTo.plusDays(1).atStartOfDay(), status, pageable));
    }

    @GetMapping("/reviews")
    public ResponseEntity<?> getAllReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok().body(adminService.getAllReviews(pageable));
    }

    @PatchMapping("/reviews/{id}/hide")
    public ResponseEntity<?> rejectReview(@PathVariable Integer id) {
        return ResponseEntity.ok().body(adminService.rejectReview(id));
    }

    @PostMapping("/moderation/analyze")
    public ResponseEntity<Map<String, Object>> analyzeComment(@RequestBody Map<String, String> request) {
        String commentText = request.get("comment");
        if (commentText == null || commentText.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Bình luận không hợp lệ"));
        }

        Map<String, Double> results = adminService.analyzeComment(commentText);

        Map<String, Object> response = new HashMap<>();
        response.put("comment", commentText);
        response.put("labels", results);

        return ResponseEntity.ok(response);
    }
}