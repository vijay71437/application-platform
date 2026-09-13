package com.vijay.platform.security.entity;

import com.vijay.platform.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Optional;

@Entity
@Table(name = "refresh_tokens")
@Getter
@Setter
public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch=FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id",nullable = false)
    private User user;
    @Column(name="token_hash",nullable = false)
    private String tokenHash;
    @Column(name = "expires_at",nullable = false)
    private LocalDateTime expiresAt;
    @Column(nullable = false)
    private boolean revoked=false;
    @Column(name = "created_at",nullable = false)
    private LocalDateTime createdAt;
}
