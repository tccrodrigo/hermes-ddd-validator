# Java Spring DDD Example

Clean DDD implementation with Spring Boot.

## Architecture

```
src/main/java/com/example/demo/
├── domain/user/             # Domain Layer
│   ├── User.java            # Aggregate Root with Value Objects
│   └── UserRepository.java  # Repository Interface
├── application/user/          # Application Layer
│   └── CreateUserUseCase.java
└── interfaces/web/            # Interface Layer
    └── UserController.java
```

## DDD Patterns

- **Entity**: `User` with `@Entity` annotation
- **Value Objects**: `UserId`, `Email` as `@Embeddable`
- **Repository**: Interface extending JpaRepository
- **Domain Services**: Application layer with Use Cases
- **Dependency Injection**: Spring manages dependencies

## Validation

```bash
node ../../../scripts/validate-ddd.js . --visual
```
