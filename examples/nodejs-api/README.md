# Node.js DDD Example

Complete REST API example using Domain-Driven Design with TypeScript.

## Architecture

```
src/
├── domain/user/          # Domain Layer
│   ├── User.ts           # Aggregate Root
│   ├── UserId.ts         # Value Object
│   ├── Email.ts          # Value Object
│   ├── UserCreatedEvent.ts # Domain Event
│   └── UserRepository.ts # Repository Interface
├── application/user/       # Application Layer
│   └── CreateUserUseCase.ts
├── infrastructure/       # Infrastructure Layer
│   └── persistence/
│       └── PrismaUserRepository.ts
└── api/                  # Interface Layer
    └── controllers/
        └── UserController.ts
```

## DDD Patterns Demonstrated

- **Aggregate Root**: `User` is the aggregate root with encapsulated business rules
- **Value Objects**: `UserId` and `Email` are immutable value objects
- **Domain Events**: `UserCreatedEvent` for loose coupling
- **Repository Pattern**: Interface in domain, implementation in infrastructure
- **Dependency Rule**: Dependencies point inward (domain has no external deps)

## Validation

```bash
npm run validate
# or with visual report
node ../../scripts/validate-ddd.js . --visual
```
