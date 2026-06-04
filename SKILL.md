---
name: ddd-architecture-validator
description: >
  Validates Domain-Driven Design (DDD) architecture across Node.js, React, Java Spring Boot, and Python projects.
  Analyzes folder structure, layer dependencies (domain/application/infrastructure/presentation),
  and detects violations. Generates visual architecture diagrams.
  Use when: user mentions "DDD", "domain-driven design", "validate architecture", "check layers",
  "bounded context", "aggregate root", or before implementing DDD features.
---

# DDD Architecture Validator

Multi-language DDD validation tool for Node.js, React, Java Spring Boot, and Python projects.

## When to Use

- Before implementing new DDD features
- When reviewing/refactoring existing code
- When user says: "DDD", "domain-driven design", "validate architecture", "check layers", "bounded context", "aggregate root", "this follows DDD?", "is this entity correct?"

## Framework Detection

Auto-detects project type by scanning config files:

| Framework | Detection |
|-----------|-----------|
| Java Spring Boot | `pom.xml`, `build.gradle`, `@SpringBootApplication` |
| Node.js | `package.json`, `tsconfig.json` |
| React | `vite.config.*`, `react` in package.json |
| Python | `pyproject.toml`, `requirements.txt`, `setup.py` |

## DDD Layer Rules

Validates 4 layers in order of importance:

1. **Domain** (inner/core) - No dependencies outward
   - Entities, Value Objects, Aggregates, Domain Events, Domain Services, Repository interfaces
   - MUST NOT import: application, infrastructure, presentation

2. **Application** - Only depends on domain
   - Use Cases, Application Services, DTOs, Mappers
   - CAN import: domain
   - MUST NOT import: infrastructure, presentation

3. **Infrastructure** - Implements domain interfaces
   - Repositories (impl), External APIs, DB config, Message queues
   - CAN import: domain, application (for use cases)
   - MUST NOT import: presentation

4. **Presentation** (outer) - Depends on all
   - Controllers, Components, Views, Hooks
   - CAN import: all layers (but prefer application services)

## Validation Checks

**Structure checks:**
- Are DDD folders present? (`domain/`, `application/`, `infrastructure/`)
- Entities have proper naming? (Entity suffix or in entities/ folder)
- Aggregates have root marker? (`AggregateRoot` interface/pattern)

**Dependency checks:**
- Domain imports from domain only
- Application imports from domain + application only
- Infrastructure implements domain interfaces
- No circular dependencies between bounded contexts

**React-specific DDD:**
- Presentation layer = Components + Pages
- Application logic in hooks/services
- Domain = Types + Business logic (pure functions)
- No direct API calls from components (use application layer)

## Commands

Run validation:
```
validate-ddd [path] [--visual] [--strict] [--doc=./docs] [--bounded-context=<name>]
```

Options:
- `--visual` — Generate HTML dashboard + Markdown docs (C4 model)
- `--strict` — Fail on any violation (exit code 1)
- `--doc=<path>` — Output directory for documentation (default: `./docs`)
- `--bounded-context=<name>` — Validate specific context only

**Quick start:**
```bash
# Generate docs for current project
node ~/.hermes/skills/software-development/ddd-architecture-validator/scripts/validate-ddd.js . --visual

# With custom output
validate-ddd . --visual --doc=./architecture

# CI/CD strict mode
validate-ddd . --strict || exit 1
```

## Output Format

```
DDD Validation Report: <project-name>
Framework: <detected>
Bounded Contexts: <n> found

✓ Structure
  Found: domain/, application/, infrastructure/
  ✓ 12 entities detected
  ✓ 4 aggregates with root markers
  ! 2 entities without proper naming convention

✓ Dependencies
  ✓ Domain layer clean (0 outward deps)
  ✗ Application imports infrastructure at:
    - src/application/order/useCase.ts:17 imports '../../infrastructure/db'

✓ Bounded Contexts
  ✓ user-context boundaries clean
  ✓ order-context boundaries clean
  ! inventory-context → user-context: 3 dependencies (should use domain events)

Summary: 2 errors, 1 warning, 14 checks passed
```

## Visual Output (C4 Model)

With `--visual`, generates interactive HTML report:

**Files created in `--doc=./docs` (default):**
- `index.html` - Main navigation page
- `architecture-c4.html` - C4 diagrams: Context → Container → Component → Code
- `bounded-contexts.html` - Context map with relationships
- `layer-validation.html` - Clean Architecture layers + violations
- `adr/` - Architecture Decision Records (MDs for AI context)
  - `0001-architecture-overview.md` - Links to all diagrams
  - `0002-bounded-contexts.md` - Context details
  - `0003-layer-rules.md` - Layer validation results

**C4 Diagram Levels:**

| Level | Name | Shows | For |
|-------|------|-------|-----|
| 1 | System Context | Users + external systems | Stakeholders |
| 2 | Containers | Apps + DBs + services | Dev/Arch |
| 3 | Components | Modules inside containers | Developers |
| 4 | Code | Classes/modules (optional) | Detailed work |

**HTML Features:**
- Dark theme by default
- Drill-down navigation (Context → Container → Component)
- Zoom/pan on diagrams
- Overlay showing DDD violations on the diagram
- Export PNG/SVG

**AI Context (MD files):**
For every validation, creates `.md` files in `--doc` folder that LLMs can read:
```
./docs/
├── INDEX.md                     # Quick links to all docs
├── C4_CONTEXT.md               # System Context description
├── C4_CONTAINERS.md            # Container breakdown
├── C4_COMPONENTS.md            # Component-level details
├── VALIDATION_REPORT.md        # Pass/fail with line refs
└── BOUNDED_CONTEXTS.md         # Context definitions + deps
```

LLM reads `INDEX.md` first, then follows links to specific concerns.

## Implementation Guide

To add validation to a new project:

1. Run `validate-ddd . --visual` to baseline
2. Fix all structure errors
3. Run before PR: `validate-ddd . --strict`
4. Review diagrams in `./docs/`

## Technical Reference

For implementation details, troubleshooting, and development notes:
- See `references/implementation-notes.md`

> DDD Validator generates report with ${violations.length} violations.
> LLM reads ./docs/INDEX.md → sees violations.
> If violations > 0, invoke PLANNING PHASE.

## Post-Validation: DDD Adequacy Planning

When validation finds violations (errors/warnings), the next step is **creating an adequacy plan** using the `brainstorming` skill.

### When to Invoke

After any validation with `violations.length > 0`:

```
/brainstorming Criar plano de adequação DDD para [projeto]

Contexto:
- Framework: {{framework}}
- Violations: {{violations.length}} ({{errors}} errors, {{warnings}} warnings)
- Docs: {{docPath}}/VALIDATION_REPORT.md
- C4 Components: {{docPath}}/C4_COMPONENTS.md

Objectivo: Migrar codebase para DDD clean.
```

### Plan Components

The brainstorming skill should create:

1. **Current State Assessment**
   - Read VALIDATION_REPORT.md
   - Map violations to architectural debt
   - Identify tech hotspots

2. **Target Architecture Design**
   - Proposed bounded contexts
   - Correct layer placement for each file
   - Interface extraction points

3. **Migration Strategy**
   - **Option A: Big Bang** — Rewrite all at once (small projects)
   - **Option B: Incremental** — Context by context (recommended)
   - **Priority:** Security → Core domain → Supporting

4. **Refactoring Tasks** (prioritized)
   | Priority | Task | Effort | Risk |
   |----------|------|--------|------|
   | P0 | Fix Domain → Infra imports | Low | High |
   | P1 | Extract Repository interfaces | Medium | Medium |
   | P2 | Move Use Cases to Application | Low | Low |
   | P3 | Introduce Domain Events | High | Medium |

5. **Validation Checkpoints**
   - After each phase: re-run `validate-ddd . --strict`
   - Target: 0 errors before next phase

### Example Session

```
User: validate este repo
Hermes: ✅ Validated. Found 3 violations. Invocando /brainstorming...

/brainstorming:
  "Analisar VALIDATION_REPORT.md e criar plano de adequação DDD.
   
   Violações encontradas:
   - Domain importando Infrastructure (2x)
   - Application sem interfaces (1x)
   
   Criar:
   1. Mapeamento de onde cada arquivo DEVE estar
   2. Passos para extrair interfaces
   3. Ordem de refatoração segura
   4. Checkpoints de validação"

Output: adequacy-plan.md em ./docs/plans/
```

## Resume

| If violations | Then |
|---------------|------|
| 0 | ✅ Clean. Proceed with feature development. |
| > 0 | 📝 Invoke `/brainstorming` → create adequacy plan → execute → re-validate. |