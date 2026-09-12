package com.vijay.platform.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;


@Service
public class JwtService {

    private final SecretKey secretKey;
    private final long accessTokenExpiration;

    public JwtService(
            @Value("${jwt.secret}") String secretKey,
            @Value("${jwt.access-token-expiration}") long accessTokenExpiration){
        this.secretKey= Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
        this.accessTokenExpiration=accessTokenExpiration;
    }

    public String generateAccessToken(String username){
        Date now=new Date();
        Date expiration=new Date(now.getTime()+accessTokenExpiration);
        return Jwts.builder()
                .subject(username)
                .issuedAt(now)
                .expiration(expiration)
                .signWith(secretKey)
                .compact();
    }

    public String extractUsername(String token){
        return extractAllClaims(token).getSubject();
    }
    public Claims extractAllClaims(String token){
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean isTokenValide(String token){
        try{
            Claims claims=extractAllClaims(token);
            return claims.getExpiration().after(new Date());
        }catch (Exception e){
            return false;
        }
    }

    public long getAccessTokenExpiration(){
        return accessTokenExpiration;
    }


}
