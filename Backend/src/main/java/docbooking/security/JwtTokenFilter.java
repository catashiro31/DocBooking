package docbooking.security;

import docbooking.repositories.TokenBlacklistRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@AllArgsConstructor
@Slf4j
public class JwtTokenFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    // 🔥 Tiêm trực tiếp class này để dùng được hàm loadUserById
    private final CustomUserDetails customUserDetails;
    private final TokenBlacklistRepository tokenBlacklistRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        try {
            String token = jwtTokenProvider.resolveToken(request);

            if (token != null && jwtTokenProvider.validateToken(token)) {

                // Kiểm tra token có trong blacklist không
                if (tokenBlacklistRepository.existsByToken(token)) {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json;charset=UTF-8");
                    response.getWriter().write("{\"error\": \"Token đã bị vô hiệu hóa. Vui lòng đăng nhập lại.\"}");
                    return;
                }

                // 🔥 1. Lấy ID (dạng String) từ Token và chuyển sang số nguyên
                String userIdStr = jwtTokenProvider.getUserIdFromToken(token);
                Integer userId = Integer.parseInt(userIdStr);

                // 🔥 2. Tìm User bằng ID
                UserDetails userDetails = customUserDetails.loadUserById(userId);

                // 3. Kiểm tra tài khoản có bị khóa không
                if (userDetails instanceof docbooking.models.User user && !Boolean.TRUE.equals(user.getIsActive())) {
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.setContentType("application/json;charset=UTF-8");
                    response.getWriter().write("{\"error\": \"Tài khoản của bạn đã bị khóa.\"}");
                    return;
                }

                // 4. Set quyền vào Context
                if (userDetails != null) {
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        } catch (Exception e) {
            // Bắt lỗi an toàn để không làm sập server nếu token chứa chuỗi không phải là số ID hợp lệ
            log.error("Không thể thiết lập xác thực người dùng trong Security Context", e);
        }

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getServletPath();
        return path.startsWith("/api/v1/auth/") && !path.equals("/api/v1/auth/signout");
    }
}