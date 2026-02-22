package docbooking.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter @Setter
@Table(name = "SPECIALTIES")
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Specialty {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "specialty_id")
    private Integer specialty_id;

    @Column(name = "specialty_name", length = 100, nullable = false)
    private String special_name;

    @Lob
    @Column(name = "description")
    private String description;

    @Column(name = "image_url")
    private String image_url;

    @OneToMany(mappedBy = "specialty", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<DoctorDetail> doctor_details;
}
