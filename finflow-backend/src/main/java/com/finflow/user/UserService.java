package com.finflow.user;

import org.springframework.stereotype.Service;
import com.finflow.user.dto.RegisterUserRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.finflow.exception.DuplicateEmailException;
import com.finflow.user.dto.LoginRequest;

import java.util.Locale;

@Service

public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(RegisterUserRequest request) {

        String normalizedEmail = request.email().trim().toLowerCase();

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new DuplicateEmailException("Email is already registered.");
        }

        String passwordHash = passwordEncoder.encode(request.password());

        User user = new User(
                request.firstName().trim(),
                request.lastName().trim(),
                normalizedEmail,
                passwordHash
        );

        return userRepository.save(user);
    }

    public User authenticate(LoginRequest request) {

        String normalizedEmail = request.email().trim().toLowerCase();

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        return user;
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
    }
}

