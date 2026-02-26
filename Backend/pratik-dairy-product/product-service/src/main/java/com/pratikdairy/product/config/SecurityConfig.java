//package com.pratikdairy.product.config;
//
//// 1. USE THE CORRECT IMPORT FOR HttpMethod
//import org.springframework.http.HttpMethod;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
//import org.springframework.security.web.SecurityFilterChain;
//
//import static org.springframework.security.config.Customizer.withDefaults;
//
//@Configuration
//@EnableWebSecurity
//public class SecurityConfig {
//
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http
//                .authorizeHttpRequests(auth -> auth
////                        // 2. THIS IS MANDATORY FOR ANGULAR. DO NOT COMMENT IT OUT.
////                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
////
////                        // 3. ALLOW ALL PUBLIC ENDPOINTS (including images, single products, and search)
////                        .requestMatchers(
////                                "/products/all",
////                                "/products/admin/**",
////                                "/products/product/**", // Allows viewing single product
////                                "/products/*/image",    // Allows images to load
////                                "/products/search"      // Allows search
////                        ).permitAll()
//
//                        .anyRequest().permitAll()
//                )
//                .csrf(AbstractHttpConfigurer::disable)
//                .httpBasic(withDefaults());
//
//        return http.build();
//    }
//}