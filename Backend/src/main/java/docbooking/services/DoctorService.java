package docbooking.services;

import docbooking.dtos.requests.BulkScheduleRequestDTO;
import docbooking.models.DoctorDetail;
import docbooking.models.DoctorSchedule;
import docbooking.repositories.DoctorDetailRepository;
import docbooking.repositories.DoctorScheduleRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DoctorService {
    private final DoctorScheduleRepository doctorScheduleRepository;
    private final DoctorDetailRepository doctorDetailRepository;
    @Transactional
    public void createDoctorSchedule(Integer userId, BulkScheduleRequestDTO bulkScheduleRequestDTO) {
        DoctorDetail doctor = doctorDetailRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin bác sĩ."));

        for(String slotName: bulkScheduleRequestDTO.getSlotIds()){
            DoctorSchedule.TimeSlot timeSlot = DoctorSchedule.TimeSlot.valueOf(slotName);

            if(doctorScheduleRepository.existsByDoctor_DoctorIdAndDateWorkingAndTimeSlot(
                    doctor.getDoctorId(), bulkScheduleRequestDTO.getDate(), timeSlot)){
                continue;
            }
            DoctorSchedule doctorSchedule = new DoctorSchedule();
            doctorSchedule.setDoctor(doctor);
            doctorSchedule.setDateWorking(bulkScheduleRequestDTO.getDate());
            doctorSchedule.setTimeSlot(timeSlot);

            doctorSchedule.setSlotStatus(DoctorSchedule.SlotStatus.AVAILABLE);
            doctorScheduleRepository.save(doctorSchedule);
        }
    }

}
