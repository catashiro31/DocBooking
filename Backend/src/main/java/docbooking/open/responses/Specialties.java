package docbooking.open.responses;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Specialties {
    private Integer id;
    private String name;
    private String description;
}
