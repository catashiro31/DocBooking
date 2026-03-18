package docbooking.controllers;

import docbooking.models.User;
import docbooking.security.SecurityUtils;
import docbooking.services.AdminService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}