package docbooking.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "FACILITIES")
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

    @Lob
    @Column(name = "description")
    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    @OneToMany(mappedBy = "facility", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<DoctorDetail> doctorDetails;
}
