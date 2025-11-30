package com.pratikdairy.user.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;

import java.util.Optional;

@Configuration
public class AuditConfig {

    // after authentication i have to make it dynamic
    @Bean
    public AuditorAware<String> auditorProvider() {
        return () -> Optional.of("ADMIN");  // default user
    }
}
