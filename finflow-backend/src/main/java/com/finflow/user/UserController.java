package com.finflow.user;

import com.finflow.user.dto.UserResponse;
import com.finflow.user.dto.RegisterUserRequest;
import com.finflow.user.dto.UserResponse;
import com.finflow.user.dto.LoginRequest;
import com.finflow.user.dto.LoginResponse;
import com.finflow.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;


@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    public UserController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterUserRequest request) {

        User user = userService.register(request);

        UserResponse response = new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getCreatedAt()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        User user = userService.authenticate(request);

        String token = jwtService.generateToken(user);

        return ResponseEntity.ok(
                new LoginResponse(token, "Bearer")
        );
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication) {

        String email = authentication.getName();

        User user = userService.findByEmail(email);

        UserResponse response = new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getCreatedAt()

        );

        return ResponseEntity.ok(response);
    }
}
