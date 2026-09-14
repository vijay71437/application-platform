package com.vijay.platform.authorization.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class AssignPermissionsRequest {

    @NotEmpty(message = "Permission ids are required")
    private Set<@NotNull Long> permissionIds;
}