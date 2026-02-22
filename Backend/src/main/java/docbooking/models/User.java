package docbooking.models;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name= "USERS")
@Getter
@Setter

public class Users {
    @Id
    private Integer user_id;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "password_hash")
    private String password_hash;

    @Column(name = "full_name", length = 100)
    private String full_name;

    @Column(name = "phone_number", length = 10)
    private String phone_number;

    public enum RoleStatus {
        ADMIN,
        DOCTOR,
        PATIENT
    }
    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private RoleStatus role;

    @Column(name = "is_active")
    private Boolean is_active;

    @Column(name = "avatar_url")
    private String avatar_url;

    @Column(name = "created_at")
    private LocalDateTime created_at;

    @Column(name = "updated_at")
    private LocalDateTime updated_at;
}
