package com.pratikdairy.user.jwt;


import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Component
@Slf4j
public class JwtUtils {

    private final String SECRET = "PratikDairyAndSweetsSecretKeyForWebsite";
    private final long EXPIRATION_TIME = 1000 * 60 * 60 * 10 ;


    private Key getSecretKey()
    {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }


    public String generateToken(String userId , String userRole)
    {
        return Jwts.builder()
                .setSubject(userId)
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
//        Date expiration = Jwts.parserBuilder()
//                .setSigningKey(getSecretKey())
//                .build()
//                .parseClaimsJws(token)
//                .getBody()
//                .getExpiration();

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
            // Log "Token signature is invalid: token was tampered with"
            return false;
        } catch (Exception e) {
            // Catch all other exceptions (ExpiredJwtException, MalformedJwtException, etc.)
            // This makes the JwtAuthFilter code cleaner by only getting 'false' here
            return false;
        }
    }


}
