package docbooking.controllers;

import docbooking.dtos.requests.AppointmentRequestDTO;
import docbooking.dtos.requests.RelativeRequestDTO;
import docbooking.dtos.requests.ReviewRequestDTO;
import docbooking.dtos.responses.AppointmentResponseDTO;
import docbooking.models.User;
import docbooking.security.SecurityUtils;
import docbooking.services.AppointmentService;
import docbooking.services.PatientProfileService;
import jakarta.validation.Valid;
import lombok.Builder;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("api/v1/patient")
@Builder
@PreAuthorize("hasAnyAuthority('PATIENT')")
public class PatientController {
    private final PatientProfileService patientProfileService;
    private final AppointmentService appointmentService;
    @PostMapping("relatives")
    public ResponseEntity<?> createRelative(@RequestBody RelativeRequestDTO req) {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(patientProfileService.addRelative(currentUser, req));
    }

    @GetMapping("relatives/{id}")
    public ResponseEntity<?> getRelativeDetail(@PathVariable Integer id) {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(patientProfileService.getRelativeById(id, currentUser));
    }

    @GetMapping("relatives")
    public ResponseEntity<?> getAllRelatives() {
        User currentUser = SecurityUtils.getCurrentUser();
        return  ResponseEntity.ok(patientProfileService.getMyRelatives(currentUser));
    }

    @PutMapping("relatives/{id}")
    public ResponseEntity<?> updateRelative(@PathVariable Integer id, @RequestBody RelativeRequestDTO req) {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(patientProfileService.updateRelative(id, currentUser, req));
    }
    @DeleteMapping("relatives/{id}")
    public ResponseEntity<?> deleteRelative(@PathVariable Integer id) {
        User currentUser = SecurityUtils.getCurrentUser();
        patientProfileService.deleteRelative(currentUser, id);
        return ResponseEntity.ok("Xóa hồ sơ người thân thành công");
    }

    @PostMapping("/appointments")
    public ResponseEntity<?> bookAppointment(@RequestBody AppointmentRequestDTO req) {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(appointmentService.createAppointment(currentUser, req));
    }
    @GetMapping("/appointments")
    public ResponseEntity<?> getMyAppointments() {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(appointmentService.getMyAppointments(currentUser));
    }
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelAppointment(@PathVariable Integer id) {
        User currentUser = SecurityUtils.getCurrentUser();
        AppointmentResponseDTO response = appointmentService.cancelAppointment(currentUser, id);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/history")
    public ResponseEntity<?> getHistory() {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(appointmentService.getPatientHistory(currentUser));
    }

    @GetMapping("/history/{id}")
    public ResponseEntity<?> getHistoryDetail(@PathVariable Integer id) {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(appointmentService.getAppointmentDetail(currentUser, id));
    }
    @PostMapping("/appointments/{id}/review")
    public ResponseEntity<?> createReview(@PathVariable Integer id, @Valid @RequestBody ReviewRequestDTO req) {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(appointmentService.saveOrUpdateReview(currentUser, id, req, false));
    }

    @PutMapping("/appointments/{id}/review")
    public ResponseEntity<?> updateReview(@PathVariable Integer id, @Valid @RequestBody ReviewRequestDTO req) {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(appointmentService.saveOrUpdateReview(currentUser, id, req, true));
    }

    @PostMapping("/appointments/{id}/payment-proof")
    public ResponseEntity<?> uploadPaymentImage(@PathVariable Integer id, @RequestParam("file") MultipartFile file) {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(appointmentService.uploadPaymentImage(id, file, currentUser));
    }
}
