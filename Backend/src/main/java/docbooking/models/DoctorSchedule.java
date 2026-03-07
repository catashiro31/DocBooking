package docbooking.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "doctor_schedules")
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class DoctorSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "schedule_id")
    private Integer scheduleId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id")
    private DoctorDetail doctor;

    @Column(name = "date_working")
    private LocalDate dateWorking;

    @Enumerated(EnumType.STRING)
    @Column(name = "time_slot")
    private TimeSlot timeSlot;

    @Enumerated(EnumType.STRING)
    @Column(name = "slot_status")
    private SlotStatus slotStatus;

    @Getter
    public enum TimeSlot {
        SLOT_09_00("09:00"),
        SLOT_10_00("10:00"),
        SLOT_11_00("11:00"),
        SLOT_14_00("14:00"),
        SLOT_15_00("15:00"),
        SLOT_16_00("16:00"),
        SLOT_17_00("17:00");

        private final String displayValue;

        TimeSlot(String displayValue) {
            this.displayValue = displayValue;
        }

    }

    public enum SlotStatus {
        AVAILABLE, BOOKED, CLOSED
    }

    @OneToMany(mappedBy = "schedule", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Appointment> appointments;
}
