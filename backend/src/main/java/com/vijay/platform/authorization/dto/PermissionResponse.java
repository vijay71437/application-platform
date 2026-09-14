package com.vijay.platform.authorization.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PermissionResponse {
    private Long id;
    private String name;
}
