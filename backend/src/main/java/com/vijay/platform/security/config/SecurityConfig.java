package com.vijay.platform.security.config;

import com.vijay.platform.security.handler.CustomAccessDeniedHandler;
import com.vijay.platform.security.handler.CustomAuthenticationEntryPoint;
import com.vijay.platform.security.jwt.JwtAuthenticationFilter;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity
@EnableWebSecurity
public class SecurityConfig {

    private final CustomAuthenticationEntryPoint
            authenticationEntryPoint;

    private final CustomAccessDeniedHandler
            accessDeniedHandler;

    private final SecurityProperties securityProperties;

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
    @Bean
    public CorsConfigurationSource corsConfigurationSource(){
        CorsConfiguration configuration=new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(securityProperties.getCors().getAllowedOrigins()));
        configuration.setAllowedMethods(List.of("GET","POST","PUT","DELETE","PATCH","OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization",
                "Content-Type",
                "X-Request-ID"));
        configuration.setExposedHeaders(
                List.of(
                        "X-Request-ID"
                )
        );
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );
        return source;
    }
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http){
        http
                .csrf(csrf->csrf.disable())
                .cors(Customizer.withDefaults())
                .headers(headers -> headers
                        .frameOptions(frame ->
                                frame.deny()
                        )
                        .contentTypeOptions(Customizer.withDefaults())
                )
                .sessionManagement(session->session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(exception->
                        exception.authenticationEntryPoint(authenticationEntryPoint)
                                .accessDeniedHandler(accessDeniedHandler))
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                )
                .authorizeHttpRequests(auth ->
                        auth.requestMatchers(
                        "/api/v1/auth/register",
                        "/api/v1/auth/login",
                        "/api/v1/auth/refresh",
                        "/api/v1/auth/logout",
                        "/api/health",
                        "/swagger-ui/**",
                        "/swagger-ui.html",
                        "/v3/api-docs/**"
                ).permitAll().anyRequest().authenticated());
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration){
        return configuration.getAuthenticationManager();
    }
}
