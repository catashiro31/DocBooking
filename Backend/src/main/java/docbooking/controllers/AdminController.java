package docbooking.controllers;

import docbooking.models.DoctorDetail;
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
        try {
            DoctorDetail doctor = adminService.approveDoctor(id);
            return  ResponseEntity.ok(doctor);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectDoctor(@PathVariable long id, @RequestParam String reason) {
        try {
            DoctorDetail doctor = adminService.rejectDoctor(id, reason);
            return ResponseEntity.ok().body(doctor);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
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