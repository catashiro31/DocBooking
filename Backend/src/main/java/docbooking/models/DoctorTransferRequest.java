package docbooking.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter @Setter
@Table(name = "doctor_transfer_requests")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class DoctorTransferRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private DoctorDetail doctor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_facility_id", nullable = false)
    private Facility targetFacility;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(name = "reason", columnDefinition = "TEXT")
    private String reason;

    @Column(name = "admin_note", columnDefinition = "TEXT")
    private String adminNote;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime processedAt;

    public enum Status {
        PENDING, APPROVED, REJECTED
    }
}
