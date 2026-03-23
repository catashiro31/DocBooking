package docbooking.exceptions;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import org.springframework.security.access.AccessDeniedException;


@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<?> handleAccessDenied(AccessDeniedException ex, HttpServletRequest request) {
        String path = request.getRequestURI();
        String message = "Bạn không có quyền truy cập!";

        if (path.contains("/api/v1/admin")) {
            message = "Khu vực này chỉ dành cho Quản trị viên!";
        } else if (path.contains("/api/v1/patient")) {
            message = "Tính năng này chỉ dành cho Bệnh nhân!";
        } else if (path.contains("/api/v1/doctor-management")) {
            message = "Chỉ Bác sĩ mới có quyền vào đây!";
        }

        // Trả về 403 Forbidden
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(message);
    }

    // 2. ĐỂ XUỐNG DƯỚI: Xử lý lỗi nghiệp vụ chung (400)
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

}
