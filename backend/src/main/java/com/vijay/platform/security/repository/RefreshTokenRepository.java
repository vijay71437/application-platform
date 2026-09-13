package com.vijay.platform.security.repository;

import com.vijay.platform.security.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken,Long> {
    Optional<RefreshToken> findByTokenHash(String tokenHash);
    @Query("""
        SELECT rt
        FROM RefreshToken rt
        JOIN FETCH rt.user
        WHERE rt.tokenHash = :tokenHash
    """)
    Optional<RefreshToken> findByTokenHashWithUser(
            @Param("tokenHash") String tokenHash
    );

    List<RefreshToken> findAllByUserIdAndRevokedFalse(Long userId);
}
