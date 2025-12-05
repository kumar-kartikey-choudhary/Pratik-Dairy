package com.pratikdairy.parent.utility;

import com.pratikdairy.parent.config.GatewayPrincipal;
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
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String userIdHeader = request.getHeader("X-Auth-UserId");
        String roleHeader = request.getHeader("X-Auth-Role");

        if(userIdHeader != null && roleHeader != null && SecurityContextHolder.getContext().getAuthentication() == null)
        {
            try {
                long userId = Long.parseLong(userIdHeader);
                GatewayPrincipal gatewayPrincipal = new GatewayPrincipal(userId, roleHeader);
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(gatewayPrincipal, null, gatewayPrincipal.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
            }catch (NumberFormatException e)
            {
                logger.warn("Gateway passed non-numeric User ID header:::");
            }
        }
        filterChain.doFilter(request, response);
    }
}
