package com.vijay.platform.authorization.repository;

import com.vijay.platform.authorization.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByName(String name);
    boolean existsByName(String name);
    List<Role> findAllByIdIn(Set<Long> ids);
}