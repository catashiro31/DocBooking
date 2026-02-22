package docbooking.models;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Getter @Setter
@Table(name = "DOCTOR_DETAILS")
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class DoctorDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "doctor_id")
    private Integer doctor_id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "user_id", unique = true)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "specialty_id", nullable = false)
    private Specialty specialty;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "facility_id", nullable = false)
    private Facility facility;

    @Lob
    @Column(name = "bio")
    private String bio;

    @Column(name = "degree", length = 50)
    private String degree;

    @Column(name = "experience_years")
    private Integer experience_years;

    @Column(name = "price", precision = 15, scale = 2)
    private BigDecimal price;

    @Column(name = "id_card_url")
    private String id_card_url;

    @Column(name = "certificate_url")
    private String certificate_url;

    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status")
    private VerificationStatus verification_status;

    @Column(name = "rating_average", precision = 2, scale = 1)
    private BigDecimal rating_average;

    @Column(name = "review_count")
    private Integer review_count;

    public enum VerificationStatus {
        PENDING, APPROVED, REJECTED
    }

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<DoctorSchedule> doctor_schedules;

}
