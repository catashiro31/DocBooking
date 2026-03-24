package docbooking.controllers;

import docbooking.dtos.requests.BulkScheduleRequestDTO;
import docbooking.models.User;
import docbooking.security.SecurityUtils;
import docbooking.services.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/doctor")
@PreAuthorize("hasAnyAuthority('DOCTOR')")
public class DoctorController {
    private final DoctorService doctorService;
    @PostMapping("/schedules")
    public ResponseEntity<?> createSchedules(
            @RequestBody BulkScheduleRequestDTO bulkScheduleRequestDTO){
        User currentUser = SecurityUtils.getCurrentUser(); // Thống nhất cách lấy user
        doctorService.createDoctorSchedule(currentUser.getUserId(), bulkScheduleRequestDTO);
        return ResponseEntity.ok("Tạo lịch làm việc thành công!");
    }
}
