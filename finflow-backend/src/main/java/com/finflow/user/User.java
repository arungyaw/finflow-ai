package com.finflow.user;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    @PrePersist
    protected void onCreate() {
        // Set internally so clients cannot control the account creation timestamp.
        this.createdAt = LocalDateTime.now();
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public User() {

    }

    public User(String firstName, String lastName, String email, String passwordHash) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.passwordHash = passwordHash;
    }




    @Column(name= "first_name", nullable = false, length= 100)
    private String firstName;

    @Column(name= "last_name", nullable = false, length= 100)
    private String lastName;

    @Column(nullable = false, unique=true, length= 255)
    private String email;

    @Column(name= "password_hash", nullable = false, length= 255)
    private String passwordHash;

    @Column(name= "created_at", nullable = false)
    private LocalDateTime createdAt;
}
