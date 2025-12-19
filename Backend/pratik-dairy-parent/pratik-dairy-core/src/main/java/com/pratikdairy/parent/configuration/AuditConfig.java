//package com.pratikdairy.parent.configuration;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.data.domain.AuditorAware;
//
//import java.util.Optional;
//
//@Configuration
//public class AuditConfig {
//
//    @Bean
//    public AuditorAware<String> auditorProvider() {
//        return () -> Optional.of("ADMIN");  // default user
//    }
//}