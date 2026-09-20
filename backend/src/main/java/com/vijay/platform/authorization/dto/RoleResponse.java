package com.vijay.platform.authorization.dto;

import com.vijay.platform.authorization.entity.Permission;
import lombok.Builder;
import lombok.Getter;

import java.util.Set;
@Getter
@Builder
public class RoleResponse {

    private long id;
    private String name;
    private Set<String> permissions;
}
