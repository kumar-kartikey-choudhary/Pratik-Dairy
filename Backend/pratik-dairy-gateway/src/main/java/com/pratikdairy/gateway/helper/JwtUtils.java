package com.pratikdairy.gateway.helper;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Component
@Slf4j
public class JwtUtils {

    private final String SECRET = "PratikDairyAndSweetsSecretKeyForWebsite";


    private Key getSecretKey()
    {
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
//        Date expiration = Jwts.parserBuilder()
//                .setSigningKey(getSecretKey())
//                .build()
//                .parseClaimsJws(token)
//                .getBody()
//                .getExpiration();

        final Date expiration = this.extractClaim(token, Claims::getExpiration);
        return expiration.before(new Date());
    }


}
