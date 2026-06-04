# C4 Container Diagram (Level 2)

**Scope:** {{PROJECT_NAME}} — Containers
**Purpose:** Shows apps, databases, and services inside {{PROJECT_NAME}}

---

## System Boundary

```
┌─────────────────────────────────────────────────────────────┐
│                      {{PROJECT_NAME}}                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  Web App     │  │   API        │  │  Database    │        │
│  │  (React)     │  │   ({{API_TYPE}}) │  │  ({{DB_TYPE}})   │        │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘        │
│         │                 │                 │               │
│         └───{{PROTOCOL}}────────┴─────────{{PROTOCOL}}────────┘               │
└─────────┬───────────────────────────────────────────────────┘
          │
    {{USERS}}
```

---

## Containers

| Name | Type | Tech | Description |
|------|------|------|-------------|
{{CONTAINERS_TABLE}}

---

## Container Relationships

| Source | Target | Protocol | Description |
|--------|--------|----------|-------------|
{{RELATIONSHIPS_TABLE}}

---

## DDD Layers Inside Containers

{{DDD_LAYERS_SECTION}}

---

## Layer Violations Detected

{{CONTAINER_VIOLATIONS}}

---

## Next Level

See [C4_COMPONENTS.md](C4_COMPONENTS.md) for modules inside each container.
