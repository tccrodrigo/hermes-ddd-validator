# Python FastAPI DDD Example

Clean DDD implementation with FastAPI using dataclasses for value objects.

## Architecture

```
src/
├── domain/
│   └── user.py              # Domain Layer (Entities, VOs, Repository interface)
├── application/
│   └── user_service.py      # Application Layer (Use cases)
└── api/
    └── routes.py            # Interface Layer (FastAPI routes)
```

## DDD Patterns

- **Value Objects**: `Email`, `UserId` with `@dataclass(frozen=True)`
- **Aggregate Root**: `User` with domain events
- **Repository Interface**: ABC class in domain layer
- **Use Cases**: Application services orchestrate operations
- **DTOs**: Pydantic models for API input/output

## Run

```bash
pip install fastapi uvicorn
uvicorn src.api.routes:app --reload
```

## Validate

```bash
node ../../../scripts/validate-ddd.js . --visual
```
