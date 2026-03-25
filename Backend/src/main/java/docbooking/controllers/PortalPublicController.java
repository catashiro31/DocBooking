package docbooking.controllers;

import docbooking.dtos.responses.DoctorCardDTO;
import docbooking.dtos.responses.DoctorDetailDTO;
import docbooking.dtos.responses.ReviewDTO;
import docbooking.dtos.responses.SlotResponseDTO;
import docbooking.services.PortalPublicService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/portal")
public class PortalPublicController {
    private final PortalPublicService portalService;
    @GetMapping("/doctors")
    public ResponseEntity<?> getDoctors(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer specId,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double priceTo
    ){
        List <DoctorCardDTO> response = portalService.getDoctors(keyword, specId, minPrice, priceTo);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/doctors/{id}")
    public ResponseEntity<?> getDoctorDetail(@PathVariable Integer id) {
        DoctorDetailDTO response = portalService.getDoctorById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/doctors/{id}/reviews")
    public ResponseEntity<?> getDoctorReviews(@PathVariable Integer id){
        List<ReviewDTO> response = portalService.getReviewsByDoctorId(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/doctors/{id}/slots")
    public ResponseEntity<?> getDoctorSlots(
            @PathVariable Integer id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date){
        List<SlotResponseDTO> response = portalService.getAvailableSlots(id, date);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/facilities")
    public ResponseEntity<?> getAllFacility(){
        return ResponseEntity.ok(portalService.getAllFacilities());
    }
    @GetMapping("/specialties")
    public ResponseEntity<?> getAllSpecialty(){
        return ResponseEntity.ok(portalService.getAllSpecialties());
    }

}
