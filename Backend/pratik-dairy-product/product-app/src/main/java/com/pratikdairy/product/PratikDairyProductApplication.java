package com.pratikdairy.product;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableFeignClients
@EnableJpaAuditing
@ComponentScan(basePackages = "com.pratikdairy.product")
public class PratikDairyProductApplication {

	public static void main(String[] args) {
		SpringApplication.run(PratikDairyProductApplication.class, args);
	}

}
