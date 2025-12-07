package com.pratikdairy.gateway.util;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Predicate;

@Component
public class RouteValidator {

    // Define paths that are publicly accessible (no token required)
    public static final List<String> openApiEndpoints = List.of(
            "**/users/login",
            "**/users/register",
            "/eureka" // Important for Eureka clients
            // Add public product paths if needed, e.g., "/products/all", "/products/find"
    );

    // Predicate to check if a request path is NOT in the open list
    public Predicate<ServerHttpRequest> isSecured =
            request -> openApiEndpoints
                    .stream()
                    .noneMatch(uri -> request.getURI().getPath().contains(uri));
}