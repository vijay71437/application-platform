package com.vijay.platform.common.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI applicationPlatformOpenApi(){
        return new OpenAPI()
                .info(new Info()
                        .title("Application platform Api")
                        .version("1.0.0")
                        .description("Reusable application platform for authentication, "+
                                "authorization, user management and common platform services")
                )
                .components(new Components()
                        .addSecuritySchemes("bearerAuth",new SecurityScheme().name("Authorization")
                                .type(SecurityScheme.Type.HTTP).scheme("bearer").bearerFormat("JWT")));

    }
}
