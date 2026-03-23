package docbooking.controllers;

import docbooking.dtos.requests.FacilityRequestDTO;
import docbooking.dtos.requests.SpecialtyRequestDTO;
import docbooking.models.DoctorDetail;
import docbooking.models.Specialty;
import docbooking.models.User;
import docbooking.security.SecurityUtils;
import docbooking.services.AdminService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasAnyAuthority('ADMIN')")
public class AdminController {
    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok(adminService.getStats());
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
    public ResponseEntity<?> addSpecialty(@RequestBody SpecialtyRequestDTO req) {
        return ResponseEntity.ok(adminService.addSpecialty(req));
    }

    @PutMapping("/specialty/{id}")
    public ResponseEntity<?> updateSpecialty(@PathVariable Integer id, @RequestBody SpecialtyRequestDTO req) {
        return ResponseEntity.ok(adminService.updateSpecialty(id,req));
    }

    @DeleteMapping("/specialty/{id}")
    public ResponseEntity<?> deleteSpecialty(@PathVariable Integer id) {
        return ResponseEntity.ok(adminService.deleteSpecialty(id));
    }

    @PostMapping("/facility")
    public ResponseEntity<?> addFacility(@RequestBody FacilityRequestDTO req) {
        return ResponseEntity.ok(adminService.addFacility(req));
    }

    @PutMapping("/facility/{id}")
    public ResponseEntity<?> updateFacility(@PathVariable Integer id, @RequestBody FacilityRequestDTO req) {
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
}