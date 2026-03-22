package docbooking.controllers;

import docbooking.services.FacilityService;
import lombok.Builder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Builder
@RequestMapping("api/v1/facilities")
public class FacilityController {
    private final FacilityService facilityService;
    @GetMapping
    public ResponseEntity<?> getAll(){
        return ResponseEntity.ok(facilityService.getAllFacilities());
    }
}
