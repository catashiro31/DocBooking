package docbooking.controllers;

import docbooking.dtos.responses.DoctorCardDTO;
import docbooking.dtos.responses.DoctorDetailDTO;
import docbooking.dtos.responses.ReviewDTO;
import docbooking.dtos.responses.SlotResponDTO;
import docbooking.services.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("api/v1/doctors")
public class DoctorController {
    private final DoctorService doctorService;
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

    @GetMapping("/{id}/slots")
    public ResponseEntity<?> getDoctorSlots(
            @PathVariable Integer id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date){
        List<SlotResponDTO> respon = doctorService.getAvailableSlots(id, date);
        return ResponseEntity.ok(respon);
    }
}
