package docbooking.services;

import docbooking.dtos.responses.SpecialtyResponseDTO;
import docbooking.repositories.SpecialtyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SpecialtyService {
    private final SpecialtyRepository specialtyRepository;
    public List<SpecialtyResponseDTO> getAllSpecialties() {
        return specialtyRepository.findAll().stream()
                .map(s -> SpecialtyResponseDTO.builder()
                        .id(s.getSpecialtyId())
                        .name(s.getSpecialtyName())
                        .description(s.getDescription())
                        .imageUrl(s.getImageUrl())
                        .build())
                .toList();
    }
}
