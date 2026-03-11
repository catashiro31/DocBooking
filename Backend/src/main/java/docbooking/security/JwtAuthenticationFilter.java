package docbooking.security;

import docbooking.services.RedisTokenService;
import io.jsonwebtoken.io.IOException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    // Báo lỗi nếu có
    private final HandlerExceptionResolver handlerExceptionResolver;

    private final JwtUtils jwtUtils;
    private final UserDetailsService userDetailsService;

    private final RedisTokenService redisTokenService;

    public JwtAuthenticationFilter(
            JwtUtils jwtUtils,
            UserDetailsService userDetailsService,
            HandlerExceptionResolver handlerExceptionResolver,
            RedisTokenService redisTokenService
            ) {
        this.jwtUtils = jwtUtils;
        this.userDetailsService = userDetailsService;
        this.handlerExceptionResolver = handlerExceptionResolver;
        this.redisTokenService = redisTokenService;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException, java.io.IOException {
        final String authHeader = request.getHeader("Authorization");

        // Bỏ qua vì đã có xác thực đằng sau
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Bắt lỗi
        try {
            final String jwt = authHeader.substring(7);

            if (redisTokenService.isTokenBlackListed(jwt)) {
                handlerExceptionResolver.resolveException(request, response, null,
                        new RuntimeException("Token đã đăng xuất"));
            }
            // Tìm email từ token
            final String userEmail = jwtUtils.extractUsername(jwt);

            // Kiểm tra user đã được check-in trong hệ thống chưa
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


            if (userEmail != null && authentication == null) {
                // Lấy thông tin
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

                // Check token
                if (jwtUtils.isTokenValid(jwt, userDetails)) {
                    // Cấp token
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    // Ghi chú đi từ cổng nào tới
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    // Lưu thông tin token lại
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
            // Đưa vào trong
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            handlerExceptionResolver.resolveException(request, response, null, e);
        }
    }
}
