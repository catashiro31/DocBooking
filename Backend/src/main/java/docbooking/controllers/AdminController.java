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
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {
    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        User currentUser = SecurityUtils.getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Bạn chưa đăng nhập!");
        }
        if (!currentUser.getRole().toString().equals("ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Bạn không có quyền quản trị viên!");
        }
        return ResponseEntity.ok(adminService.getStats());
    }

    @GetMapping("/doctor-pending")
    public ResponseEntity<?> getDoctorPending() {
        User currentUser = SecurityUtils.getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Bạn chưa đăng nhập!");
        }
        if (!currentUser.getRole().toString().equals("ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Bạn không có quyền quản trị viên!");
        }
        return ResponseEntity.ok(adminService.getPendingDoctors());
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveDoctor(@PathVariable long id) {
        User currentUser = SecurityUtils.getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Bạn chưa đăng nhập!");
        }
        if (!currentUser.getRole().toString().equals("ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Bạn không có quyền quản trị viên!");
        }
        try {
            DoctorDetail doctor = adminService.approveDoctor(id);
            return  ResponseEntity.ok(doctor);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectDoctor(@PathVariable long id, @RequestParam String reason) {
        User currentUser = SecurityUtils.getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Bạn chưa đăng nhập!");
        }
        if (!currentUser.getRole().toString().equals("ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Bạn không có quyền quản trị viên!");
        }
        try {
            DoctorDetail doctor = adminService.rejectDoctor(id, reason);
            return ResponseEntity.ok().body(doctor);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/specialty")
    public ResponseEntity<?> addSpecialty(@RequestBody SpecialtyRequestDTO req) {
        User currentUser = SecurityUtils.getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Bạn chưa đăng nhập!");
        }
        if (!currentUser.getRole().toString().equals("ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Bạn không có quyền quản trị viên!");
        }
        return ResponseEntity.ok(adminService.addSpecialty(req));
    }

    @PutMapping("/specialty/{id}")
    public ResponseEntity<?> updateSpecialty(@PathVariable long id, @RequestBody SpecialtyRequestDTO req) {
        User currentUser = SecurityUtils.getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Bạn chưa đăng nhập!");
        }
        if (!currentUser.getRole().toString().equals("ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Bạn không có quyền quản trị viên!");
        }
        return ResponseEntity.ok(adminService.updateSpecialty(id,req));
    }

    @DeleteMapping("/specialty/{id}")
    public ResponseEntity<?> deleteSpecialty(@PathVariable long id) {
        User currentUser = SecurityUtils.getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Bạn chưa đăng nhập!");
        }
        if (!currentUser.getRole().toString().equals("ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Bạn không có quyền quản trị viên!");
        }
        return ResponseEntity.ok(adminService.deleteSpecialty(id));
    }

    @PostMapping("/facility")
    public ResponseEntity<?> addFacility(@RequestBody FacilityRequestDTO req) {
        User currentUser = SecurityUtils.getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Bạn chưa đăng nhập!");
        }
        if (!currentUser.getRole().toString().equals("ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Bạn không có quyền quản trị viên!");
        }
        return ResponseEntity.ok(adminService.addFacility(req));
    }

    @PutMapping("/facility/{id}")
    public ResponseEntity<?> updateFacility(@PathVariable long id, @RequestBody FacilityRequestDTO req) {
        User currentUser = SecurityUtils.getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Bạn chưa đăng nhập!");
        }
        if (!currentUser.getRole().toString().equals("ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Bạn không có quyền quản trị viên!");
        }
        return ResponseEntity.ok(adminService.updateFacility(id, req));
    }

    @DeleteMapping("/facility/{id}")
    public ResponseEntity<?> deleteFacility(@PathVariable long id) {
        User currentUser = SecurityUtils.getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Bạn chưa đăng nhập!");
        }
        if (!currentUser.getRole().toString().equals("ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Bạn không có quyền quản trị viên!");
        }
        return ResponseEntity.ok(adminService.deleteFacility(id));
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        User currentUser = SecurityUtils.getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Bạn chưa đăng nhập!");
        }
        if (!currentUser.getRole().toString().equals("ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Bạn không có quyền quản trị viên!");
        }
        return ResponseEntity.ok().body(adminService.getAllUsers());
    }

    @PatchMapping("/users/{id}/block")
    public ResponseEntity<?> setBlocked(@PathVariable long id, @RequestParam String reason) {
        User currentUser = SecurityUtils.getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Bạn chưa đăng nhập!");
        }
        if (!currentUser.getRole().toString().equals("ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Bạn không có quyền quản trị viên!");
        }
        return ResponseEntity.ok().body(adminService.setBlockedUser(id,reason));
    }
}