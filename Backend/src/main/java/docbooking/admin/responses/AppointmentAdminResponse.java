package docbooking.admin.responses;

import docbooking.models.Appointment;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentAdminResponse {
    private Integer appointmentId;
    
    // Patient Info
    private Integer patientId;
    private String patientName;
    private String patientPhone;
    private String patientEmail;
    
    // Doctor & Context Info
    private Integer doctorId;
    private String doctorName;
    private String specialtyName;
    private String facilityName;
    
    // Schedule Info
    private LocalDate dateWorking;
    private String timeSlot;
    
    // Booking Details
    private String reason;
    private Appointment.BookingStatus bookingStatus;
    private LocalDateTime createdAt;
}
