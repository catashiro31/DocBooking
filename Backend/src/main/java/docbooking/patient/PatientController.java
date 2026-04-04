package docbooking.patient;

import docbooking.models.User;
import docbooking.patient.requests.Appointment;
import docbooking.patient.requests.Relative;
import docbooking.patient.requests.Review;
import docbooking.utils.Security;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/patient")
@RequiredArgsConstructor
@PreAuthorize("hasAnyAuthority('PATIENT')")
public class PatientController {
    private final PatientService patientService;
    @PostMapping("/relatives")
    public ResponseEntity<?> createRelative(@Valid @RequestBody Relative req) {
        User currentUser = Security.getCurrentUser();
        return ResponseEntity.ok(patientService.addRelative(currentUser, req));
    }

    @GetMapping("/relatives/{id}")
    public ResponseEntity<?> getRelativeDetail(@PathVariable Integer id) {
        User currentUser = Security.getCurrentUser();
        return ResponseEntity.ok(patientService.getRelativeById(id, currentUser));
    }

    @GetMapping("/relatives")
    public ResponseEntity<?> getAllRelatives() {
        User currentUser = Security.getCurrentUser();
        return  ResponseEntity.ok(patientService.getMyRelatives(currentUser));
    }

    @PutMapping("/relatives/{id}")
    public ResponseEntity<?> updateRelative(@PathVariable Integer id, @Valid @RequestBody Relative req) {
        User currentUser = Security.getCurrentUser();
        return ResponseEntity.ok(patientService.updateRelative(id, currentUser, req));
    }
    @DeleteMapping("/relatives/{id}")
    public ResponseEntity<?> deleteRelative(@PathVariable Integer id) {
        User currentUser = Security.getCurrentUser();
        patientService.deleteRelative(currentUser, id);
        return ResponseEntity.ok("Xóa hồ sơ người thân thành công");
    }

    @PostMapping("/appointments")
    public ResponseEntity<?> bookAppointment(@Valid @RequestBody Appointment req) {
        User currentUser = Security.getCurrentUser();
        return ResponseEntity.ok(patientService.createAppointment(currentUser, req));
    }
    @GetMapping("/appointments")
    public ResponseEntity<?> getMyAppointments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        User currentUser = Security.getCurrentUser();
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(patientService.getMyAppointments(currentUser, pageable));
    }
    @PutMapping("/appointments/{id}/cancel")
    public ResponseEntity<?> cancelAppointment(@PathVariable Integer id) {
        User currentUser = Security.getCurrentUser();
        docbooking.patient.responses.Appointment response = patientService.cancelAppointment(currentUser, id);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/history")
    public ResponseEntity<?> getHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate
    ) {
        User currentUser = Security.getCurrentUser();
        Pageable pageable = PageRequest.of(page, size);
        java.time.LocalDate start = startDate != null ? java.time.LocalDate.parse(startDate) : null;
        java.time.LocalDate end = endDate != null ? java.time.LocalDate.parse(endDate) : null;
        return ResponseEntity.ok(patientService.getPatientHistory(currentUser, start, end, pageable));
    }

    @GetMapping("/history/{id}")
    public ResponseEntity<?> getHistoryDetail(@PathVariable Integer id) {
        User currentUser = Security.getCurrentUser();
        return ResponseEntity.ok(patientService.getAppointmentDetail(currentUser, id));
    }
    @PostMapping("/appointments/{id}/review")
    public ResponseEntity<?> createReview(@PathVariable Integer id, @Valid @RequestBody Review req) {
        User currentUser = Security.getCurrentUser();
        return ResponseEntity.ok(patientService.saveOrUpdateReview(currentUser, id, req, false));
    }

    @PutMapping("/appointments/{id}/review")
    public ResponseEntity<?> updateReview(@PathVariable Integer id, @Valid @RequestBody Review req) {
        User currentUser = Security.getCurrentUser();
        return ResponseEntity.ok(patientService.saveOrUpdateReview(currentUser, id, req, true));
    }

}
