package com.pratikdairy.jwt.config;

import com.pratikdairy.user.model.User;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class GatewayAuthFilter extends OncePerRequestFilter {

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {

        String path = request.getRequestURI();
        return path.endsWith("/users/register") || path.endsWith("/users/login");
    }



    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String userIdHeader = request.getHeader("X-Auth-UserId");
        String role = request.getHeader("X-Auth-Role");

        if(userIdHeader != null && role != null && SecurityContextHolder.getContext().getAuthentication() == null)
        {
            try {
                long userId = Long.parseLong(userIdHeader);
                User user = new User(userId, role);
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
            }catch (NumberFormatException e)
            {
                logger.warn("Gateway passed non-numeric User ID header:::");
            }
        }
        filterChain.doFilter(request, response);
    }
}
