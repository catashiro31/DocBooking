package docbooking.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter @Setter
@Table(name = "doctor_details")
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class DoctorDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "doctor_id")
    private Integer doctorId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "user_id", unique = true)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "specialty_id", nullable = false)
    private Specialty specialty;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "facility_id", nullable = false)
    private Facility facility;

    @Column(name = "bio", columnDefinition = "TEXT")
    private String bio;

    @Column(name = "degree", length = 50)
    private String degree;

    @Column(name = "experience_years")
    private Integer experienceYears;

    @Column(name = "price")
    private Double price;

    @Column(name = "id_card_url")
    private String idCardUrl;

    @Column(name = "certificate_url")
    private String certificateUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status")
    private VerificationStatus verificationStatus;

    @Column(name = "rating_average")
    private Double ratingAverage;

    @Column(name = "review_count")
    private Integer reviewCount;

    public enum VerificationStatus {
        PENDING, APPROVED, REJECTED
    }

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<DoctorSchedule> doctorSchedules;

}
