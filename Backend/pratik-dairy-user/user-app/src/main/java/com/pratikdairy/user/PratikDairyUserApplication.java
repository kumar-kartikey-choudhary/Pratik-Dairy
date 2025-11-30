package com.pratikdairy.user;

import com.pratikdairy.user.model.User;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableFeignClients
@EnableJpaAuditing
@EntityScan(basePackageClasses = User.class)
public class PratikDairyUserApplication {

	public static void main(String[] args) {
		SpringApplication.run(PratikDairyUserApplication.class, args);
	}

}

