//package com.pratikdairy.parent.configuration;
//
//
//import com.pratikdairy.parent.helper.JwtAuthEntryPoint;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
//import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
//import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.security.web.SecurityFilterChain;
//
//@Configuration
//@EnableMethodSecurity
//@EnableWebSecurity
//@Slf4j
//public class SecurityConfig {
//
//    private final JwtAuthEntryPoint entryPoint;
//
//    @Autowired
//    public SecurityConfig(JwtAuthEntryPoint entryPoint)
//    {
//        this.entryPoint = entryPoint;
//    }
//
//    @Bean
//    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception
//    {
//        http.authorizeHttpRequests(auth -> auth
//                .requestMatchers("/users/register" , "/users/login").permitAll()
//                .anyRequest().authenticated())
//                .csrf(AbstractHttpConfigurer::disable)
//                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
//             //.exceptionHandling(ex -> ex.authenticationEntryPoint(entryPoint));
//
//        return http.build();
//    }
//
//    @Bean
//    public PasswordEncoder encoder()
//    {
//        return new BCryptPasswordEncoder();
//    }
//
//    @Bean
//    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception
//    {
//        return configuration.getAuthenticationManager();
//    }
//
////    @Bean
////    public DaoAuthenticationProvider provider()
////    {
////        return new DaoAuthenticationProvider(this.encoder());
////    }
//
//}
