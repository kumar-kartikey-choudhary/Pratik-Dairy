package com.pratikdairy.gateway.filter;

import com.pratikdairy.gateway.util.RouteValidator;
import com.pratikdairy.parent.utility.JwtUtil;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.core.io.buffer.DataBufferFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;

@Component
public class AuthenticationFilter implements GlobalFilter {

    private static final Logger log = LoggerFactory.getLogger(AuthenticationFilter.class);
    @Autowired
    private JwtUtil jwtUtil; // From pratik-dairy-core
    @Autowired
    private RouteValidator validator;


    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        System.out.println("Inside @class Authentication @method filter");
        if (validator.isSecured.test(request)) {
            // 1. Check for Authorization header
            if (!request.getHeaders().containsKey("Authorization")) {
                return this.onError(exchange, "Authorization header missing", HttpStatus.UNAUTHORIZED);
            }

            String authHeader = request.getHeaders().getFirst("Authorization");
            log.info("AuthHeader:{}", authHeader);
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return this.onError(exchange, "Invalid Authorization header format", HttpStatus.UNAUTHORIZED);
            }
            String token = authHeader.substring(7);

            try {
                jwtUtil.validateToken(token);
                Claims claims = jwtUtil.getAllClaimsFromToken(token);

                // 3. Inject authenticated user identity into request headers
                exchange.getRequest().mutate()
                        // Use userId and role from JWT claims
                        .header("X-Auth-UserId", claims.get("userId", Long.class).toString())
                        .header("X-Auth-Role", claims.get("userRole", String.class))
                        .build();

            } catch (JwtException e) {
                // Handle token errors (Expired, Signature, etc.)
                log.info("Invalid or Expired JWT Token:{}", HttpStatus.UNAUTHORIZED);
                return this.onError(exchange, "Invalid or Expired JWT Token", HttpStatus.UNAUTHORIZED);
            } catch (Exception e) {
                log.info("Internal token processing error:{}", HttpStatus.UNAUTHORIZED);
                return this.onError(exchange, "Internal token processing error", HttpStatus.UNAUTHORIZED);
            }
        }
        // 4. Continue to the downstream service
        return chain.filter(exchange);
    }

    private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus httpStatus) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(httpStatus);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON); // Set content type

        // Create a simple JSON error body
        String jsonError = String.format("{\"timestamp\": \"%s\", \"status\": %d, \"error\": \"Authentication Failed\", \"message\": \"%s\", \"path\": \"%s\"}",
                java.time.ZonedDateTime.now(), httpStatus.value(), err, exchange.getRequest().getPath());

        DataBufferFactory dataBufferFactory = response.bufferFactory();
        DataBuffer buffer = dataBufferFactory.wrap(jsonError.getBytes(StandardCharsets.UTF_8));

        return response.writeWith(Mono.just(buffer));
    }
}