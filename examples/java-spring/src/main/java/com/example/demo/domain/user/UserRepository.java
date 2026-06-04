package com.example.demo.domain.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * Repository Interface
 * Part of Domain Layer - defines contract for persistence
 */
@Repository
public interface UserRepository extends JpaRepository<User, UserId> {
    Optional<User> findByEmail(Email email);
    boolean existsByEmail(Email email);
}
