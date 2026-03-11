package docbooking.configs;

import docbooking.security.JwtAuthenticationFilter;
import docbooking.services.LogoutService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {
    private final AuthenticationProvider authenticationProvider;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final LogoutService logoutService;

    public SecurityConfiguration(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            AuthenticationProvider authenticationProvider, LogoutService logoutService
    ) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.authenticationProvider = authenticationProvider;
        this.logoutService = logoutService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Tắt hệ thống xử lý cũ (rườm ra)
                .csrf(csrf -> csrf.disable())
                // Khu vực hoạt động
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/v1/auth/**", "/error").permitAll()
                        .anyRequest().authenticated()
                )

                // Không lưu State để tiết kiệm Ram
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // Cấp quyền xác minh
                .authenticationProvider(authenticationProvider)
                // Thiết lập điều hướng trước
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)

                // Đăng xuất
                .logout(logout -> logout
                    .logoutUrl("/api/v1/auth/logout")
                    .addLogoutHandler(logoutService)
                    .logoutSuccessHandler((request, response, authentication) ->
                            SecurityContextHolder.clearContext()
                    )
                );
        return http.build();
    }

    // Giao tiếp với Frontend
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Danh sách tền miền cho phép gọi API
        configuration.setAllowedOrigins(List.of("https://backend.com", "http://localhost:8080", "http://localhost:5020"));
        // Loại phương thước cho phép
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH"));
        // Cấu trúc nhận dữ liệu
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));

        // Thiết lập bộ quy luật trên
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}