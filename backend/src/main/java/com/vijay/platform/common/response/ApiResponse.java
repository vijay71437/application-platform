package com.vijay.platform.common.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.Instant;

@AllArgsConstructor
@Getter
public class ApiResponse<T> {

    private boolean success;
    private String message;
    private T data;
    private Instant   timestamp;

    public ApiResponse(
            boolean success,
            String message,
            T data) {

        this.success = success;
        this.message = message;
        this.data = data;
        this.timestamp = Instant.now();
    }

    public static <T> ApiResponse<T> success(String message, T data){
        return new ApiResponse<>(true,message,data);
    }

    public static <T> ApiResponse<T> error(String message,T data){
        return new ApiResponse<>(false,message,data);
    }

}
