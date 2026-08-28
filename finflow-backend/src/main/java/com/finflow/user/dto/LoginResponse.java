package com.finflow.user.dto;

public record LoginResponse(
        String token,
        String tokenType
) {
}
