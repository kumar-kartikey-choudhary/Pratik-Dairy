package com.pratikdairy.order;

import com.pratikdairy.parent.configuration.AuditConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableFeignClients(basePackages = {
		"com.pratikdairy.cart.controller",
		"com.pratikdairy.product.controller"
})
@EnableJpaAuditing
@Import(AuditConfig.class)
public class PratikDairyOrderApplication {

	public static void main(String[] args) {
		SpringApplication.run(PratikDairyOrderApplication.class, args);
	}

}
