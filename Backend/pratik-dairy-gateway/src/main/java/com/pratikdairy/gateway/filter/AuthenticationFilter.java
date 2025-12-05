package com.pratikdairy.gateway.filter;

import com.pratikdairy.gateway.util.RouteValidator;
import com.pratikdairy.parent.utility.JwtUtil;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class AuthenticationFilter implements GatewayFilter {

    @Autowired
    private JwtUtil jwtUtil; // From pratik-dairy-core
    @Autowired
    private RouteValidator validator;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();

        if (validator.isSecured.test(request)) {
            // 1. Check for Authorization header
            if (!request.getHeaders().containsKey("Authorization")) {
                return this.onError(exchange, "Authorization header missing", HttpStatus.UNAUTHORIZED);
            }

            String authHeader = request.getHeaders().getFirst("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return this.onError(exchange, "Invalid Authorization header format", HttpStatus.UNAUTHORIZED);
            }
            String token = authHeader.substring(7);

            try {
                // 2. Validate Token (signature and expiration check)
                // If validation fails, JwtUtil will throw a JwtException
                jwtUtil.validateToken(token);
                Claims claims = jwtUtil.getAllClaimsFromToken(token);

                // 3. Inject authenticated user identity into request headers
                exchange.getRequest().mutate()
                        // Use userId and role from JWT claims
                        .header("X-Auth-UserId", claims.get("userId", String.class))
                        .header("X-Auth-Role", claims.get("userRole", String.class))
                        .build();

            } catch (JwtException e) {
                // Handle token errors (Expired, Signature, etc.)
                return this.onError(exchange, "Invalid or Expired JWT Token", HttpStatus.UNAUTHORIZED);
            } catch (Exception e) {
                return this.onError(exchange, "Internal token processing error", HttpStatus.UNAUTHORIZED);
            }
        }

        // 4. Continue to the downstream service
        return chain.filter(exchange);
    }

    private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus httpStatus) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(httpStatus);
        // Optional: Add logging here
        return response.setComplete();
    }
}