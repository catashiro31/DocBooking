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
    private Integer facility_id;

    @Column(name = "facility_name")
    private String facility_name;

    @Column(name = "address")
    private String address;

    @Lob
    @Column(name = "description")
    private String description;

    @Column(name = "image_url")
    private String image_url;

    @OneToMany(mappedBy = "facility", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<DoctorDetail> doctor_details;
}
