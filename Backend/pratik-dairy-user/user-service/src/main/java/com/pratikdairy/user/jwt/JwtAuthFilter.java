package com.pratikdairy.user.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Slf4j
@Component
public class JwtAuthFilter extends OncePerRequestFilter {


    private final JwtUtils jwtUtils;
    private final CustomUserDetailService detailService;

    @Autowired
    public JwtAuthFilter(JwtUtils jwtUtils, CustomUserDetailService detailService)
    {
        this.jwtUtils = jwtUtils;
        this.detailService = detailService;
    }
    private static final List<String> PUBLIC_PATH = List.of(
            "/users/register",
            "/users/login"
    );

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        log.info("Inside @class JwtAuthFilter @method shouldNotFilter");
        String path = request.getRequestURI();
        boolean isPublicPath = path.contains("/users/") && PUBLIC_PATH.stream().anyMatch(path::startsWith);
        if(isPublicPath)
        {
            log.info("Skipping JWT filter for public path: {}", path);
        }
        return isPublicPath;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        final String header = request.getHeader("Authorization");
        final String username ;
        final String token;

        if(header == null || !header.startsWith("Bearer "))
        {
            log.info("Header is null or not starts with Bearer");
            filterChain.doFilter(request, response);
            return;
        }
        token = header.substring(7);
        try {
            username = jwtUtils.extractUsername(token);
            log.info("username :{}",username);
        }catch (Exception e) {
            System.err.println("JWT extraction failed: " + e.getMessage());
            filterChain.doFilter(request, response);
            return;
        }
        if(username != null && SecurityContextHolder.getContext().getAuthentication() == null)
        {
            log.info("Going to CustomUserDetailService");
            UserDetails userDetails = this.detailService.loadUserByUsername(username);
            if(this.jwtUtils.isTokenValidate(token, userDetails))
            {
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
            }
        }
        filterChain.doFilter(request, response);
    }
}
