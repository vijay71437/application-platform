package com.vijay.platform.user.utils;

import com.vijay.platform.common.exception.InvalidParameterException;
import com.vijay.platform.user.specification.UserSpecification;

import java.util.Set;

public final class UserSortFields {
    private UserSortFields(){

    }
    private static final Set<String> ALLOWED_FIELDS=Set.of(
            "id",
            "username",
            "email",
            "firstName",
            "lastName",
            "createdAt",
            "updatedAt"
    );
    public static String validate(String field){
        if(!ALLOWED_FIELDS.contains(field)){
            throw new InvalidParameterException("Invalid sort field "+field);
        }
        return field;
    }
}
