package com.pratikdairy.gateway.helper;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;

@Component
@Slf4j
public class JwtAuthentication implements GatewayFilter {

    private final JwtUtils jwtUtils;
    // Define public routes that should bypass token validation
    public static final List<String> PUBLIC_ENDPOINTS = List.of(
            "/users/login",
            "/users/register",
            "/products/all"
            // Add other public paths as needed
    );

    @Autowired
    public JwtAuthentication(JwtUtils jwtUtils) {
        this.jwtUtils = jwtUtils;
    }

    // --- Helper Method for Unauthorized Response ---
    private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus httpStatus) {
        exchange.getResponse().setStatusCode(httpStatus);
        exchange.getResponse().getHeaders().add(HttpHeaders.CONTENT_TYPE, "application/json");
        log.warn("Authentication rejected for path {}: {}", exchange.getRequest().getURI().getPath(), err);
        // Returns a simple JSON error response
        String responseBody = "{\"error\": \"" + err + "\"}";
        return exchange.getResponse().writeWith(
                Mono.just(exchange.getResponse().bufferFactory().wrap(responseBody.getBytes()))
        );
    }

    // --- Main Filter Logic ---
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getURI().getPath();

        // 1. Check if the endpoint is public (no authentication required)
        if (PUBLIC_ENDPOINTS.stream().anyMatch(path::endsWith)) {
            return chain.filter(exchange);
        }

        // 2. Check for Authorization header
        if (!exchange.getRequest().getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
            return this.onError(exchange, "Missing Authorization Header", HttpStatus.UNAUTHORIZED);
        }

        // Extract the token (Bearer <token>)
        List<String> authHeaders = exchange.getRequest().getHeaders().get(HttpHeaders.AUTHORIZATION);
        if (authHeaders == null || authHeaders.isEmpty() || !authHeaders.get(0).startsWith("Bearer ")) {
            return this.onError(exchange, "Invalid Authorization Header Format", HttpStatus.UNAUTHORIZED);
        }

        String token = authHeaders.get(0).substring(7); // Remove "Bearer "

        try {
            // 3. Validate Token Signature and Expiration
            Claims claims = jwtUtils.extractAllClaims(token);

            // Check expiration (optional redundant check, as extractAllClaims usually throws ExpiredJwtException)
            if (jwtUtils.isTokenExpired(token)) {
                return this.onError(exchange, "Token Expired", HttpStatus.UNAUTHORIZED);
            }

            // 4. Inject trusted headers for downstream microservices
            ServerWebExchange mutatedExchange = exchange.mutate()
                    .request(builder -> {
                        // Extract userId (Subject) and role (Custom Claim)
                        String userId = claims.getSubject();
                        String userRole = claims.get("role", String.class);

                        // Headers are trusted by microservices
                        builder.header("X-Auth-User-Id", userId);
                        builder.header("X-Auth-Role", userRole);
                        log.debug("JWT validated for User: {} (ID: {})", claims.getSubject(), userId);
                    })
                    .build();

            // 5. Forward the request with new headers
            return chain.filter(mutatedExchange);

        } catch (SignatureException e) {
            log.error("JWT Validation failed: Invalid Signature", e);
            return this.onError(exchange, "Invalid Token Signature", HttpStatus.UNAUTHORIZED);
        } catch (ExpiredJwtException e) {
            log.error("JWT Validation failed: Expired Token", e);
            return this.onError(exchange, "Token Expired", HttpStatus.UNAUTHORIZED);
        } catch (MalformedJwtException e) {
            log.error("JWT Validation failed: Malformed Token", e);
            return this.onError(exchange, "Malformed JWT Token", HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            log.error("JWT Validation failed: Unknown Error", e);
            return this.onError(exchange, "Authentication Failed", HttpStatus.UNAUTHORIZED);
        }
    }
}