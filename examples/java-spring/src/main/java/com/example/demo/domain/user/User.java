package com.example.demo.domain.user;

import jakarta.persistence.*;
import java.util.UUID;

/**
 * Aggregate Root: User
 * Encapsulates business logic and invariants
 */
@Entity
@Table(name = "users")
public class User {
    
    @EmbeddedId
    private UserId id;
    
    @Embedded
    private Email email;
    
    @Column(nullable = false)
    private String name;
    
    protected User() {
        // Required by JPA
    }
    
    private User(UserId id, Email email, String name) {
        this.id = id;
        this.email = email;
        this.name = name;
    }
    
    public static User create(Email email, String name) {
        User user = new User(
            UserId.generate(),
            email,
            name
        );
        // Event publishing would happen here
        return user;
    }
    
    public void updateEmail(Email newEmail) {
        this.email = newEmail;
    }
    
    // Getters
    public UserId getId() { return id; }
    public Email getEmail() { return email; }
    public String getName() { return name; }
}

@Embeddable
class UserId {
    private UUID value;
    
    protected UserId() {}
    
    private UserId(UUID value) {
        this.value = value;
    }
    
    public static UserId generate() {
        return new UserId(UUID.randomUUID());
    }
    
    public static UserId fromString(String uuid) {
        return new UserId(UUID.fromString(uuid));
    }
}

@Embeddable
class Email {
    @Column(name = "email", nullable = false, unique = true)
    private String value;
    
    protected Email() {}
    
    private Email(String value) {
        this.value = value;
    }
    
    public static Email of(String email) {
        if (email == null || !email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new IllegalArgumentException("Invalid email format");
        }
        return new Email(email);
    }
    
    public String getValue() { return value; }
}
