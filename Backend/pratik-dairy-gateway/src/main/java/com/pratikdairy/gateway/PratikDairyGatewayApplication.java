package com.pratikdairy.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.PropertySource;

@SpringBootApplication
@EnableDiscoveryClient
public class PratikDairyGatewayApplication {

	public static void main(String[] args) {
		SpringApplication.run(PratikDairyGatewayApplication.class, args);
	}

}
