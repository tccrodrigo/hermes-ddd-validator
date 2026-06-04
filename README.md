# Hermes DDD Architecture Validator

Validates Domain-Driven Design (DDD) architecture across Node.js, React, Java Spring Boot, and Python projects.

## What It Does

- 🔍 **Auto-detects** your framework (Java/Node/Python/React)
- 📊 **Scans** DDD layers (domain/, application/, infrastructure/)
- ⚠️ **Detects** layer violations (Domain → Infra imports)
- 🎨 **Generates** C4 architecture diagrams (Context/Container/Component)
- 📝 **Creates** Markdown docs for AI context

## Quick Start

```bash
# Run directly
node scripts/validate-ddd.js . --visual

# Or install locally
cp scripts/validate-ddd.js ~/my-project/scripts/
cd ~/my-project
./scripts/validate-ddd.js . --visual --doc=./docs
```

## Output

Generates in `./docs/`:
- `index.html` — Visual dashboard
- `INDEX.md` — AI entry point
- `VALIDATION_REPORT.md` — Violations table
- `C4_CONTEXT.md` — C4 Level 1
- `C4_CONTAINERS.md` — C4 Level 2
- `C4_COMPONENTS.md` — C4 Level 3
- `BOUNDED_CONTEXTS.md` — Context map

## DDD Layers Validated

| Layer | Can Import | Contains |
|-------|------------|----------|
| Domain | Nothing | Entities, Value Objects, Events |
| Application | Domain | Use Cases, Services, DTOs |
| Infrastructure | Domain (+ libs) | Repositories (impl), APIs |
| Presentation | Application | Controllers, Components |

## Commands

```bash
node validate-ddd.js [path] [options]

Options:
  --visual              Generate HTML dashboard + Markdown docs
  --strict              Exit with error code if violations found
  --doc=<path>          Output directory (default: ./docs)
  --bounded-context=<n> Validate specific context only
```

## Example Output

```
🔍 DDD Architecture Validator
──────────────────────────────────────────────────
📁 Project: my-api
🔧 Framework: nodejs
──────────────────────────────────────────────────
📊 Layers found: 4
   - domain/: 12 files
   - application/: 8 files
   - infrastructure/: 6 files
   - controllers/: 4 files
⚠️  Violations: 1 (0 errors, 1 warnings)

Detailed violations:
  WARNING: src/application/user/CreateUserUseCase.ts:2 → App imports infra

📝 RECOMMENDATION: Invoke /brainstorming to create DDD adequacy plan

🎨 Generating documentation...
✅ Generated 7 files in ./docs/
```

## Post-Validation: DDD Adequacy Planning

When violations are found, invoke `/brainstorming` to create an adequacy plan:

```
/brainstorming Create DDD adequacy plan

Context:
- Framework: [auto-detected]
- Violations: [from VALIDATION_REPORT.md]
- Docs: ./docs/

Objective: Migrate codebase to clean DDD.
```

## Supported Frameworks

- ☕ Java Spring Boot (detected via `pom.xml`, `build.gradle`)
- 🟢 Node.js/TypeScript (`package.json`, `tsconfig.json`)
- ⚛️ React (`package.json` with react)
- 🐍 Python (`requirements.txt`, `pyproject.toml`)

## License

MIT

---

## Resources

- 📖 [Installation Guide](INSTALL.md) — Detailed setup instructions
- 🤝 [Contributing Guide](CONTRIBUTING.md) — How to contribute
- 📚 [DDD Concepts](references/layer-patterns.md) — DDD pattern examples
- 🐛 [Issues](https://github.com/tccrodrigo/hermes-ddd-validator/issues) — Report bugs
- 💬 [Discussions](https://github.com/tccrodrigo/hermes-ddd-validator/discussions) — Ask questions

---

**Made for [Hermes Agent](https://github.com/monteiro74/hermes-agent)** — CLI AI Agent