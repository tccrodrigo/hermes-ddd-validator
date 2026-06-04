package com.example.demo.interfaces.web;

import com.example.demo.application.user.*;
import com.example.demo.domain.user.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller
 * Interface Layer - handles HTTP requests
 */
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    private final CreateUserUseCase createUserUseCase;
    
    public UserController(CreateUserUseCase createUserUseCase) {
        this.createUserUseCase = createUserUseCase;
    }
    
    @PostMapping
    public ResponseEntity<CreateUserResponse> createUser(
            @RequestBody CreateUserCommand command) {
        User user = createUserUseCase.execute(command);
        
        CreateUserResponse response = new CreateUserResponse(
            user.getId().toString(),
            user.getEmail().getValue(),
            user.getName()
        );
        
        return ResponseEntity.ok(response);
    }
}

create record CreateUserResponse(
    String id,
    String email,
    String name
) {}
