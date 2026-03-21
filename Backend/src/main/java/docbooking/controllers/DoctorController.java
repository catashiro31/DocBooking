package docbooking.controllers;

import docbooking.dtos.responses.DoctorCardDTO;
import docbooking.dtos.responses.DoctorDetailDTO;
import docbooking.dtos.responses.ReviewDTO;
import docbooking.services.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/doctors")
public class DoctorController {
    @Autowired
    private DoctorService doctorService;
    @GetMapping("")
    public ResponseEntity<?> getDoctors(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer specId,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double priceTo
    ){
        List <DoctorCardDTO> response = doctorService.getDoctors(keyword, specId, minPrice, priceTo);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDoctorDetail(@PathVariable Integer id) {
        DoctorDetailDTO respon = doctorService.getDoctorById(id);
        return ResponseEntity.ok(respon);
    }

    @GetMapping("/{id}/reviews")
    public ResponseEntity<?> getDoctorReviews(@PathVariable Integer id){
        List<ReviewDTO> respon = doctorService.getReviewsByDoctorId(id);
        return ResponseEntity.ok(respon);
    }
}
