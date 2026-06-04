# DDD Validation Report

**Project:** {{PROJECT_NAME}}
**Framework:** {{FRAMEWORK}}
**Generated:** {{TIMESTAMP}}
**Status:** {{OVERALL_STATUS}}

---

## Summary

| Category | Passed | Warnings | Errors |
|----------|--------|----------|--------|
| Structure | {{STRUCTURE_PASS}} | {{STRUCTURE_WARN}} | {{STRUCTURE_ERROR}} |
| Dependencies | {{DEPS_PASS}} | {{DEPS_WARN}} | {{DEPS_ERROR}} |
| Bounded Contexts | {{BC_PASS}} | {{BC_WARN}} | {{BC_ERROR}} |
| **Total** | **{{TOTAL_PASS}}** | **{{TOTAL_WARN}}** | **{{TOTAL_ERROR}}** |

---

## Structure Validation

### Folder Structure
{{FOLDER_STRUCTURE}}

### Entities Found
{{ENTITIES_FOUND}}

**Issues:**
{{STRUCTURE_ISSUES}}

---

## Dependency Validation

### Layer Dependency Rules

```
Presentation → Application → Domain
      ↓             ↓            ↓
Infrastructure → Application ❌ (VIOLATION)
```

**Allowed dependencies:**
- Domain: no outbound dependencies
- Application: domain only
- Infrastructure: domain (+ libs for impl)
- Presentation: application (prefer), infrastructure (avoid)

### Violations Found

{{DEPENDENCY_VIOLATIONS}}

| File | Line | Violation | Import |
|------|------|-----------|--------|
{{VIOLATIONS_DETAIL_TABLE}}

---

## Bounded Contexts

### Contexts Detected
{{CONTEXTS_DETECTED}}

### Context Boundaries
| Context | Entities | External Deps | Status |
|---------|----------|---------------|--------|
{{CONTEXTS_TABLE}}

---

## Recommendations

{{RECOMMENDATIONS}}

---

**Command:** `validate-ddd . --strict`
**Doc Location:** {{DOC_PATH}}
