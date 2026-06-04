package com.example.demo.application.user;

import com.example.demo.domain.user.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Application Service
 * Orchestrates use cases, coordinates domain objects
 */
@Service
@Transactional
public class CreateUserUseCase {
    
    private final UserRepository userRepository;
    
    public CreateUserUseCase(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public User execute(CreateUserCommand command) {
        Email email = Email.of(command.getEmail());
        
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already exists");
        }
        
        User user = User.create(email, command.getName());
        return userRepository.save(user);
    }
}

// DTO for input
create class CreateUserCommand {
    private String email;
    private String name;
    
    // Getters and setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
