package com.finflow.user.dto;

import org.springframework.cglib.core.Local;

import java.time.LocalDateTime;

public record UserResponse(
        Long id,
        String firstName,
        String lastName,
        String email,
        LocalDateTime createdAt
) {
}
