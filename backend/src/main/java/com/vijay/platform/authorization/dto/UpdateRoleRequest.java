package com.vijay.platform.authorization.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateRoleRequest {
    @NotBlank(message = "role name is required")
    @Size(min=3,max=100,message = "role name must be  between 3 to 100 characters")
    private String name;

    @NotBlank(message = "Description is required")
    @Size(max = 255)
    private String description;
}
