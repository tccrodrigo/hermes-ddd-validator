# DDD Layer Patterns

## Java Spring Boot

```
src/
├── domain/                    # Inner layer - no deps outward
│   ├── user/
│   │   ├── User.java          # Aggregate Root
│   │   ├── UserId.java        # Value Object
│   │   ├── UserRepository.java # Interface
│   │   └── events/
│   │       └── UserCreatedEvent.java
├── application/
│   ├── dto/
│   │   ├── UserDTO.java
│   │   └── CreateUserRequest.java
│   ├── service/
│   │   └── UserService.java   # Application Service
│   ├── usecase/
│   │   └── CreateUserUseCase.java
├── infrastructure/
│   ├── persistence/
│   │   ├── JpaUserRepository.java  # Implements domain interface
│   │   └── UserEntity.java         # JPA entity
│   └── web/
│       └── UserController.java     # REST controller
```

**Layer deps:**
- Domain: none (pure Java)
- Application: domain
- Infrastructure: domain, (spring for impl)

## Node.js / TypeScript

```
src/
├── domain/
│   ├── user/
│   │   ├── User.ts
│   │   ├── UserId.ts
│   │   ├── UserRepository.ts    # Interface
│   │   └── events/
│   │       └── UserCreatedEvent.ts
├── application/
│   ├── user/
│   │   ├── CreateUserUseCase.ts
│   │   ├── UserDTO.ts
│   │   └── UserService.ts
├── infrastructure/
│   ├── persistence/
│   │   └── PrismaUserRepository.ts
│   ├── http/
│   │   └── UserController.ts
│   └── events/
│       └── EventBus.ts
```

**Layer deps:**
- Domain: none (pure TypeScript)
- Application: domain
- Infrastructure: domain, libraries (prisma, express, etc)

## React

```
src/
├── domain/                 # Business logic, types
│   ├── entities/
│   │   ├── User.ts
│   │   └── Order.ts
│   └── valueObjects/
│       └── Money.ts
├── application/            # Use cases, state management
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useCreateOrder.ts
│   └── services/
│       └── AuthService.ts
├── infrastructure/         # API calls, storage
│   ├── api/
│   │   └── HttpClient.ts
│   └── storage/
│       └── LocalStorage.ts
├── components/             # Presentation (UI only)
│   └── user/
│       └── UserProfile.tsx
└── pages/
    └── Home.tsx
```

**Layer deps:**
- Domain: none (pure TS)
- Application: domain
- Infrastructure: domain
- Components/Pages: application (use hooks, not direct infra)

**Anti-pattern:** `fetch('/api')` directly in component ❌
**Do:** `useCreateOrder()` hook → `OrderService` → `OrderApi` ✅

## Python

```
src/
├── domain/
│   ├── user/
│   │   ├── __init__.py
│   │   ├── entities.py       # User, AggregateRoot
│   │   ├── value_objects.py  # UserId, Email
│   │   ├── repositories.py   # AbstractRepository
│   │   └── events.py
├── application/
│   ├── user/
│   │   ├── __init__.py
│   │   ├── use_cases.py      # CreateUserUseCase
│   │   ├── dtos.py
│   │   └── services.py
├── infrastructure/
│   ├── persistence/
│   │   └── sqlalchemy_repository.py
│   └── web/
│       └── fastapi_routes.py
└── api/
    └── main.py
```

**Layer deps:**
- Domain: none (pure Python)
- Application: domain
- Infrastructure: domain, libraries
