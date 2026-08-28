package com.finflow.user.dto;

import jakarta.validation.constraints.*;

public record RegisterUserRequest(

        @NotBlank
        @Size(max = 100)
        String firstName,

        @NotBlank
        @Size(max = 100)
        String lastName,

        @NotBlank
        @Email
        @Size(max = 255)
        String email,

        @NotBlank
        @Size(min =8, max = 72)
        String password

    ){
}
