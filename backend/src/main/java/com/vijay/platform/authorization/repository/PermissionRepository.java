package com.vijay.platform.authorization.repository;

import com.vijay.platform.authorization.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface PermissionRepository extends JpaRepository<Permission, Long> {

    Optional<Permission> findByName(String name);
    boolean existsByName(String name);
    List<Permission> findAllByIdIn(Set<Long> ids);
}