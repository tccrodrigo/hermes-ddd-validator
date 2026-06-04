# C4 Component Diagram (Level 3)

**Scope:** {{PROJECT_NAME}} — Internal Components
**Purpose:** Classes, services, modules inside containers

---

## Domain Layer Components

### Entities
| Name | Type | Location | Status |
|------|------|----------|--------|
{{ENTITIES_TABLE}}

### Value Objects
| Name | Used By | Location |
|------|---------|----------|
{{VALUE_OBJECTS_TABLE}}

### Repository Interfaces
| Repository | Entity | Location |
|------------|--------|----------|
{{REPOSITORIES_TABLE}}

---

## Application Layer Components

### Use Cases
| Use Case | Input | Output | Location |
|----------|-------|--------|----------|
{{USE_CASES_TABLE}}

### Application Services
| Service | Responsibilities | Location |
|---------|------------------|----------|
{{APPLICATION_SERVICES_TABLE}}

### DTOs
| DTO | Purpose | Location |
|-----|---------|----------|
{{DTOS_TABLE}}

---

## Infrastructure Layer Components

### Repository Implementations
| Implementation | Interface | Technology | Location |
|----------------|-----------|------------|----------|
{{REPO_IMPLS_TABLE}}

### External Services
| Service | Purpose | Client Location |
|---------|---------|-----------------|
{{EXTERNAL_SERVICES_TABLE}}

---

## Component Dependencies (ASCII)

```
{{COMPONENT_DIAGRAM_ASCII}}
```

---

## Violations Detected

{{COMPONENT_VIOLATIONS}}

| Severity | Component | Issue | Line |
|----------|-----------|-------|------|
{{VIOLATIONS_TABLE}}

---

**Next:** See layer details in [VALIDATION_REPORT.md](VALIDATION_REPORT.md)
