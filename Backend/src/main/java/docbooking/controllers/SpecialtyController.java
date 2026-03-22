package docbooking.controllers;

import docbooking.services.SpecialtyService;
import lombok.Builder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/specialties")
@Builder
public class SpecialtyController {
    private final SpecialtyService specialtyService;
    @GetMapping
    public ResponseEntity<?> getAll() {
        return  ResponseEntity.ok(specialtyService.getAllSpecialties());
    }
}
