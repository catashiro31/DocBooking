package docbooking.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter @Setter
@Table(name = "MEDICAL_RESULTS")
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class MedicalResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "result_id")
    private Integer resultId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id", referencedColumnName = "appointment_id", unique = true)
    private Appointment appointment;

    @Lob
    @Column(name = "diagnosis")
    private String diagnosis;

    @Column(name = "prescription_url")
    private String prescriptionUrl;

    @Lob
    @Column(name = "doctor_notes")
    private String doctorNotes;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
