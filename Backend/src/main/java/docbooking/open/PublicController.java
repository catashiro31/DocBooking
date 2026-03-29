package docbooking.open;

import docbooking.doctor.responses.Review;
import docbooking.open.responses.DoctorDetails;
import docbooking.open.responses.DoctorSlots;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/portal")
public class PublicController {
    private final PublicService portalService;
    @GetMapping("/stats")
    public ResponseEntity<?> getPortalStats() {
        return ResponseEntity.ok(portalService.getPortalStats());
    }
    @GetMapping("/doctors")
    public ResponseEntity<?> getDoctors(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer specId,
            @RequestParam(required = false) Integer facilityId,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ){
        org.springframework.data.domain.Sort sort = org.springframework.data.domain.Sort.unsorted();
        if ("rating".equalsIgnoreCase(sortBy)) {
            sort = org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "ratingAverage");
        } else if ("priceAsc".equalsIgnoreCase(sortBy)) {
            sort = org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.ASC, "price");
        } else if ("priceDesc".equalsIgnoreCase(sortBy)) {
            sort = org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "price");
        } else if ("experience".equalsIgnoreCase(sortBy)) {
            sort = org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "yearsOfExperience");
        }
        
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(portalService.getDoctors(keyword, specId, facilityId, minPrice, maxPrice, pageable));
    }

    @GetMapping("/doctors/{id}")
    public ResponseEntity<?> getDoctorDetail(@PathVariable Integer id) {
        DoctorDetails response = portalService.getDoctorById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/doctors/{id}/reviews")
    public ResponseEntity<?> getDoctorReviews(@PathVariable Integer id){
        List<Review> response = portalService.getReviewsByDoctorId(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/doctors/{id}/slots")
    public ResponseEntity<?> getDoctorSlots(
            @PathVariable Integer id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date){
        List<DoctorSlots> response = portalService.getAvailableSlots(id, date);
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
