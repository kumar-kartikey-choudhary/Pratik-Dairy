package com.pratikdairy.parent.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/auth/register") // Target the specific failing endpoint path
                .allowedOrigins("http://localhost:4200") // Angular frontend origin
                .allowedMethods("POST","OPTIONS") // Specifically allow POST requests
                .allowedHeaders("Content-Type", "Authorization")
                .allowCredentials(true);

        // Add a global rule for other API routes (if needed)
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:4200")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedMethods("*");
    }

}
