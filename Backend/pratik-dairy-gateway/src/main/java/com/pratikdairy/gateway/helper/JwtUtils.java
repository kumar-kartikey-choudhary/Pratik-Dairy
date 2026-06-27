package com.pratikdairy.gateway.helper;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Component
@Slf4j
public class JwtUtils {

    @Value("${jwt.secret}")
    private  String SECRET;


    private Key getSecretKey()
    {
        if (SECRET == null || SECRET.length() < 32) {
            throw new IllegalStateException("JWT secret must be at least 32 characters. Check jwt.secret in application.properties.");
        }
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }


    public <T> T extractClaim(String token , Function<Claims, T> claimsResolver)
    {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }


    // --- Validation Methods (Used by both Auth Service and Gateway)
    public Claims extractAllClaims(String token)
    {
        return Jwts.parserBuilder()
                .setSigningKey(getSecretKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }


    public boolean isTokenExpired(String token)
    {
        final Date expiration = this.extractClaim(token, Claims::getExpiration);
        return expiration.before(new Date());
    }


}
