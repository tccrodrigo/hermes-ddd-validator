# {{PROJECT_NAME}} — Architecture Index

**Generated:** {{TIMESTAMP}}
**Framework:** {{FRAMEWORK}}
**Validation Status:** {{STATUS}}

---

## Quick Navigation

| Document | Level | Purpose |
|----------|-------|---------|
| [C4_CONTEXT.md](C4_CONTEXT.md) | C4 L1 | Users and external systems |
| [C4_CONTAINERS.md](C4_CONTAINERS.md) | C4 L2 | Apps, DBs, services inside system |
| [C4_COMPONENTS.md](C4_COMPONENTS.md) | C4 L3 | Modules inside containers |
| [VALIDATION_REPORT.md](VALIDATION_REPORT.md) | Audit | DDD layer violations |
| [BOUNDED_CONTEXTS.md](BOUNDED_CONTEXTS.md) | Map | Contexts and their relationships |

---

## DDD Structure Overview

**Bounded Contexts Found:** {{BOUNDED_CONTEXT_COUNT}}
{{BOUNDED_CONTEXT_LIST}}

**Layer Health:**
- Domain Layer: {{DOMAIN_STATUS}}
- Application Layer: {{APPLICATION_STATUS}}
- Infrastructure Layer: {{INFRASTRUCTURE_STATUS}}
- Presentation Layer: {{PRESENTATION_STATUS}}

**Summary:**
- ✅ {{PASS_COUNT}} checks passed
- ⚠️ {{WARN_COUNT}} warnings
- ❌ {{ERROR_COUNT}} errors

---

## For AI/LLM Context

When working on this codebase:
1. Start here for overview
2. Read VALIDATION_REPORT.md before coding to check layer violations
3. Read BOUNDED_CONTEXTS.md to understand domain boundaries
4. For specific features, see C4_COMPONENTS.md

---

## Human-Readable Report

Open `index.html` in a browser for interactive diagrams with drill-down navigation.

**Commands:**
```bash
# Re-validate
validate-ddd . --visual --doc=./docs

# Strict mode (fail on warnings)
validate-ddd . --visual --strict

# Check specific bounded context only
validate-ddd . --bounded-context=user --visual
```
