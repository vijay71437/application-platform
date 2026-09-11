package com.vijay.platform.user.entity;

import com.vijay.platform.authorization.entity.Role;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false,unique = true,length = 100)
    private String username;
    @Column(nullable = false,length = 255)
    private String password;
    @Column(nullable = false,unique = true,length = 255)
    private String email;
    @Column(name = "first_name",length = 100)
    private String firstName;
    @Column(name = "last_name",length = 100)
    private String lastName;
    @Column(nullable = false)
    private boolean enabled=true;
    @Column(nullable = false)
    private boolean accountLocked=false;
    @CreatedDate
    @Column(name = "created_at",nullable = false)
    private LocalDateTime createdAt;
    @LastModifiedDate
    @Column(name = "updated_at",nullable = false)
    private LocalDateTime updatedAt;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_roles",
            joinColumns=@JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles=new HashSet<>();

}
