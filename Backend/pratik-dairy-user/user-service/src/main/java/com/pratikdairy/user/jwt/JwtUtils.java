package com.pratikdairy.user.jwt;


import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Component
@Slf4j
public class JwtUtils {

    @Value("${jwt.secret}")
    private String SECRET;

    @Value("${jwt.expiration}")
    private long EXPIRATION_TIME = 1000 * 60 * 60 * 10 ;


    private Key getSecretKey()
    {
        if (SECRET == null || SECRET.length() < 32) {
            throw new IllegalStateException("JWT secret must be at least 32 characters. Check jwt.secret in application.properties.");
        }
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }


    public String generateToken(String username , String userRole)
    {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", userRole)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSecretKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public <T> T extractClaim(String token , Function<Claims , T> claimsResolver)
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

    public String extractUsername(String token)
    {
        return Jwts.parserBuilder()
                .setSigningKey(getSecretKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean isTokenExpired(String token)
    {
        final Date expiration = this.extractClaim(token, Claims::getExpiration);
        return expiration.before(new Date());
    }

    public boolean isTokenValidate(String token , UserDetails userDetails)
    {
        try {
            String extractedUsername = this.extractUsername(token);
            final boolean matchedUsername = extractedUsername.equals(userDetails.getUsername());
            final boolean isNotExpired = !isTokenExpired(token);
            return matchedUsername && isNotExpired;
        }catch (SignatureException e) {
            return false;
        } catch (Exception e) {
            return false;
        }
    }


}
