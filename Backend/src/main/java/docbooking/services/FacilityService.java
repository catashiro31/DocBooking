package docbooking.services;

import docbooking.dtos.responses.FacilityResponseDTO;
import docbooking.models.Facility;
import docbooking.repositories.FacilityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class FacilityService {
    private final FacilityRepository facilityRepository;
    public List<FacilityResponseDTO> getAllFacilities() {
        return facilityRepository.findAll().stream()
                .map(f -> FacilityResponseDTO.builder()
                        .id(f.getFacilityId())
                        .name(f.getFacilityName())
                        .address(f.getAddress())
                        .description(f.getDescription())
                        .imageUrl(f.getImageUrl())
                        .build())
                .toList();
    }

}
