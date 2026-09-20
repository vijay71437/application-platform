package com.vijay.platform.security.service;

import com.vijay.platform.authentication.exception.InvalidRefreshTokenException;
import com.vijay.platform.security.entity.RefreshToken;
import com.vijay.platform.security.repository.RefreshTokenRepository;
import com.vijay.platform.user.entity.User;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;

@Service
@AllArgsConstructor
public class RefreshTokenService {
    private final RefreshTokenRepository refreshTokenRepository;

    private final SecureRandom secureRandom=new SecureRandom();
    private static final long REFRESH_TOKEN_DAYS=7;

    public String createRefreshToken(User user){
        byte[] random=new byte[64];
        secureRandom.nextBytes(random);
        String rowToken= Base64.getUrlEncoder().withoutPadding().encodeToString(random);
        RefreshToken refreshToken=new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setTokenHash(hashToken(rowToken));
        refreshToken.setExpiresAt(LocalDateTime.now().plusDays(REFRESH_TOKEN_DAYS));
        refreshToken.setCreatedAt(LocalDateTime.now());
        refreshToken.setRevoked(false);
        refreshTokenRepository.save(refreshToken);
        return rowToken;
    }

    public RefreshToken validateRefreshToken(String newToken){
        String tokenHash=hashToken(newToken);
        RefreshToken refreshToken=refreshTokenRepository.findByTokenHashWithUser(tokenHash).orElseThrow(InvalidRefreshTokenException::new);
        if(refreshToken.isRevoked()){
            throw  new InvalidRefreshTokenException();
        }
        if(refreshToken.getExpiresAt().isBefore(LocalDateTime.now())){
            throw  new InvalidRefreshTokenException();
        }
        return refreshToken;
    }

    public void revoke(RefreshToken refreshToken){
        refreshToken.setRevoked(true);
        refreshTokenRepository.save(refreshToken);
    }

    public void revokeRefreshToken(String rawToken) {

        String tokenHash = hashToken(rawToken);

        RefreshToken refreshToken =
                refreshTokenRepository
                        .findByTokenHash(tokenHash)
                        .orElseThrow(
                                InvalidRefreshTokenException::new
                        );

        refreshToken.setRevoked(true);

        refreshTokenRepository.save(refreshToken);
    }

    @Transactional
    public void revokeAllUserTokens(Long userId) {

        List<RefreshToken> tokens =
                refreshTokenRepository
                        .findAllByUserIdAndRevokedFalse(userId);

        for (RefreshToken token : tokens) {
            token.setRevoked(true);
        }

        refreshTokenRepository.saveAll(tokens);
    }

    private String hashToken(String rowToken){
        try{
            MessageDigest digest=MessageDigest.getInstance("SHA-256");
            byte[] hash=digest.digest(rowToken.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 algorithm is not available",e);
        }
    }

}
