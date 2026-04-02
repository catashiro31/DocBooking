package docbooking.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "facilities", indexes = {
        @Index(name = "idx_facility_is_active", columnList = "is_active")
})
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Facility {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "facility_id")
    private Integer facilityId;

    @Column(name = "facility_name")
    private String facilityName;

    @Column(name = "address")
    private String address;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "license_url")
    private String licenseUrl;

    @Column(name = "map_url", columnDefinition = "TEXT")
    private String mapUrl;

    @Builder.Default
    @Column(name = "is_verified")
    private Boolean isVerified = false;

    @Builder.Default
    @Column(name = "is_active")
    private Boolean isActive = true;

    @JsonIgnore
    @OneToMany(mappedBy = "facility", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<DoctorDetail> doctorDetails;
}
