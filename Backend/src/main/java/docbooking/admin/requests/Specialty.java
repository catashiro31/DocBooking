package docbooking.admin.requests;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Specialty {
    private String specialtyName;
    private String description;
}