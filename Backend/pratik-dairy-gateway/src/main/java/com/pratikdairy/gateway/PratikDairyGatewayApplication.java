package com.pratikdairy.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.PropertySource;

@SpringBootApplication
@EnableDiscoveryClient
//@PropertySource(value = "classpath:jwt.properties", ignoreResourceNotFound = true)
@ComponentScan(basePackages = {
//		"com.pratikdairy.parent.config",      // For GatewayAuthFilter, SecurityConfig
		"com.pratikdairy.parent.utility"})
public class PratikDairyGatewayApplication {

	public static void main(String[] args) {
		SpringApplication.run(PratikDairyGatewayApplication.class, args);
	}

}
