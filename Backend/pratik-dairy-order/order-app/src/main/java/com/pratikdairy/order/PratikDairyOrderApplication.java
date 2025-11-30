package com.pratikdairy.order;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableFeignClients
@EnableJpaAuditing
public class PratikDairyOrderApplication {

	public static void main(String[] args) {
		SpringApplication.run(PratikDairyOrderApplication.class, args);
	}

}
