package com.pratikdairy.cart;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableFeignClients(basePackages = {"com.pratikdairy.product.controller"})
@EnableJpaAuditing
public class PratikDairyCartApplication {

	public static void main(String[] args) {
		SpringApplication.run(PratikDairyCartApplication.class, args);
	}

}
