package com.vijay.platform.authorization.service;

import com.vijay.platform.authorization.dto.CreatePermissionRequest;
import com.vijay.platform.authorization.dto.PermissionResponse;
import com.vijay.platform.authorization.dto.UpdatePermissionRequest;
import com.vijay.platform.authorization.entity.Permission;
import com.vijay.platform.authorization.exception.PermissionAlreadyExistsException;
import com.vijay.platform.authorization.exception.PermissionNotFoundException;
import com.vijay.platform.authorization.repository.PermissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PermissionService {

    private final PermissionRepository permissionRepository;

    @Transactional(readOnly = true)
    public List<PermissionResponse> getAllPermissions() {

        return permissionRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public PermissionResponse getPermissionById(Long id) {

        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() ->
                        new PermissionNotFoundException(id));

        return toResponse(permission);
    }

    public PermissionResponse createPermission(
            CreatePermissionRequest request) {

        if (permissionRepository.existsByName(request.getName())) {
            throw new PermissionAlreadyExistsException(
                    request.getName());
        }

        Permission permission = new Permission();

        permission.setName(request.getName());
        permission.setDescription(request.getDescription());

        Permission savedPermission =
                permissionRepository.save(permission);

        return toResponse(savedPermission);
    }

    public PermissionResponse updatePermission(
            Long id,
            UpdatePermissionRequest request) {

        Permission permission =
                permissionRepository.findById(id)
                        .orElseThrow(() ->
                                new PermissionNotFoundException(id));

        if (!permission.getName().equals(request.getName())
                && permissionRepository.existsByName(request.getName())) {

            throw new PermissionAlreadyExistsException(
                    request.getName());
        }

        permission.setName(request.getName());
        permission.setDescription(request.getDescription());

        Permission updatedPermission =
                permissionRepository.save(permission);

        return toResponse(updatedPermission);
    }

    public void deletePermission(Long id) {

        Permission permission =
                permissionRepository.findById(id)
                        .orElseThrow(() ->
                                new PermissionNotFoundException(id));

        permissionRepository.delete(permission);
    }

    private PermissionResponse toResponse(
            Permission permission) {

        return PermissionResponse.builder()
                .id(permission.getId())
                .name(permission.getName())
                .build();
    }
}