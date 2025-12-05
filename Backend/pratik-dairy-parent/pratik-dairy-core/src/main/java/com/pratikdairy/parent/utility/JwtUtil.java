package com.pratikdairy.parent.utility;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration:86400000}") // 24 hours default
    private long expiration;

    private Key getKeys()
    {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }


    public String generateToken(String username , Long id, String role)
    {
        Map<String, Object> claim = new HashMap<>();
        claim.put("userId", id);
        claim.put("userRole", role);

        return Jwts.builder()
                .setClaims(claim)
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getKeys(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token)
    {
        return Jwts.parserBuilder()
                .setSigningKey(getKeys())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public void validateToken(final String token)
    {
        Jwts.parserBuilder().setSigningKey(getKeys()).build().parseClaimsJws(token);
    }

    public Claims getAllClaimsFromToken(String token)
    {
        return Jwts.parserBuilder().setSigningKey(getKeys()).build().parseClaimsJws(token).getBody();
    }


}
