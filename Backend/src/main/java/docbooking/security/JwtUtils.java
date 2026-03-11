package docbooking.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Getter
@Setter
@Component
public class JwtUtils {
    @Value("${security.jwt.secret-key}")
    private String jwtSecret; //Đóng dấu token

    @Value("${security.jwt.expiration-time}")
    private long jwtExpiration; //Thời hạn token

    // Tìm thông tin từ token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Giải mã token
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Sau khi đăng nhập thành công được cấp Token
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return buildToken(extraClaims, userDetails, jwtExpiration);
    }
    private String buildToken(Map<String, Object> extraClaims, UserDetails userDetails, long expiration) {
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration)) // Dùng phép CỘNG
                .signWith(getSignInKey(), SignatureAlgorithm.HS256) // Dùng HS256
                .compact();
    }

    // Kiểm tra tính khả dụng của Token
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public long getRemainingExpiration(String token) {
        try {
            // Sử dụng hàm extractExpiration bạn đã viết ở trên
            Date expiration = extractExpiration(token);

            // Tính toán khoảng cách thời gian (miliseconds)
            long remainingTime = expiration.getTime() - System.currentTimeMillis();

            // Trả về số milis còn lại, nếu đã hết hạn thì trả về 0
            return Math.max(remainingTime, 0);
        } catch (Exception e) {
            // Nếu token lỗi hoặc không thể giải mã, coi như hết hạn
            return 0;
        }
    }

    // Giải mã con dấu
    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}