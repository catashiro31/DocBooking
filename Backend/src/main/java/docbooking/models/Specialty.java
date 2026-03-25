package docbooking.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter @Setter
@Table(name = "specialties")
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Specialty {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "specialty_id")
    private Integer specialtyId;

    @Column(name = "specialty_name", length = 100, nullable = false)
    private String specialtyName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "is_active")
    private Boolean isActive;

    @JsonIgnore
    @OneToMany(mappedBy = "specialty", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<DoctorDetail> doctorDetails;
}