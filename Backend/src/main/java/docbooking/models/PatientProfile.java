package docbooking.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter @Setter
@Table(name = "PATIENT_PROFILES")
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class PatientProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "patient_id")
    private Integer patient_id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "full_name")
    private String full_name;

    @Column(name = "date_of_birth")
    private LocalDate date_of_birth;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private GenderStatus gender;

    @Column(name = "phone_number", length = 10)
    private String phone_number;

    @Column(name = "address")
    private String address;

    @Column(name = "relationship", length = 50)
    private String relationship;

    public enum GenderStatus {
        MALE, FMALE, OTHER
    }

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Appointment> appointments;
}
