package com.vijay.platform;

import com.vijay.platform.security.config.SecurityProperties;
import com.vijay.platform.security.jwt.JwtProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
@EnableConfigurationProperties({
        SecurityProperties.class,
        JwtProperties.class
})
public class ApplicationPlatformApplication {

	public static void main(String[] args) {
		SpringApplication.run(ApplicationPlatformApplication.class, args);
	}

}
