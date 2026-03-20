package docbooking.controllers;

import docbooking.dtos.requests.RelativeRequestDTO;
import docbooking.models.User;
import docbooking.security.SecurityUtils;
import docbooking.services.PatientProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/patient")
public class PatientController {
    private final PatientProfileService patientProfileService;

    public PatientController(PatientProfileService patientProfileService) {
        this.patientProfileService = patientProfileService;
    }

    @PostMapping("relatives")
    public ResponseEntity<?> createRelative(@RequestBody RelativeRequestDTO req) {
        User currentUser = SecurityUtils.getCurrentUser();
        if (currentUser==null) {
            return ResponseEntity.status(401).body("Phiên đăng nhập hết hạn!");
        }
        if(!SecurityUtils.hasRole(User.RoleStatus.PATIENT)) {
            return ResponseEntity.status(403).body("Chỉ bệnh nhân mới được dùng tính năng này!");
        }
        try {
            return ResponseEntity.ok(patientProfileService.addRelative(currentUser, req));
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }
}
