package docbooking.services;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class RedisTokenService {
    private final StringRedisTemplate redisTemplate;

    public RedisTokenService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void blackListToken(String token, long expirationTime) {
        if (expirationTime <= 0) {
            redisTemplate.opsForValue().set(token, "blacklisted",
                    Duration.ofMillis(expirationTime));
        }
    }

    public boolean isTokenBlackListed(String token) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(token));
    }
}
