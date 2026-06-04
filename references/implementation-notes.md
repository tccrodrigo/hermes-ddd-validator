# DDD Architecture Validator — Implementation Notes

## Template Escaping Lessons

**PROBLEM:** Template literals (backticks) inside template strings break when writing file generators.

**WRONG:**
```javascript
const content = `const x = `${variable}`;`  // BREAKS
```

**RIGHT:**
```javascript
const content = 'const x = "' + variable + '";'  // WORKS
```

Use string concatenation (' + var + ') instead of template literals for any code generation that will be written to disk.

## Multi-Framework Detection Heuristics

Detection order matters — check from most specific to least specific:

| Framework | Detection Files | Notes |
|-----------|-----------------|-------|
| Java Spring | `pom.xml`, `build.gradle` | Check first (build files) |
| Python | `requirements.txt`, `pyproject.toml` | Before Node (some Node projects have py for scripts) |
| React | `package.json` + `react` dep | Check after generic Node |
| Node.js | `package.json`, `tsconfig.json` | Fallback |

## Doc Structure Pattern

For AI-readable documentation, use this hierarchy:

```
./docs/
├── index.html              # Human dashboard (visual, interactive)
├── INDEX.md                # AI entry point — THIS IS READ FIRST
├── VALIDATION_REPORT.md    # Pass/fail status
├── C4_CONTEXT.md          # System level (users, external systems)
├── C4_CONTAINERS.md       # Apps, DBs, services
├── C4_COMPONENTS.md       # Classes, modules
└── BOUNDED_CONTEXTS.md    # Domain boundaries
```

**Key:** INDEX.md must have relative links to all other files so LLM can follow them.

## DDD Layer Detection Patterns

### Node.js/TypeScript
- **Domain:** Files in `domain/` with `class`, `interface`, `type`
- **Repository interface:** Contains `interface` + `repository` (case insensitive)
- **Use Case:** File name contains `use` or `case` + in `application/`

### Java Spring
- Look for `@Entity`, `@AggregateRoot` annotations
- Repository interfaces extend `JpaRepository` or similar

### React
- Domain = pure TypeScript types (no JSX)
- Application = hooks (`use` prefix)
- Infrastructure = API clients
- Presentation = Components with JSX

## Violation Detection Regex

```javascript
// Import detection (works for ES6 and CommonJS)
const importMatch = line.match(/import\s+.*?\s+from\s['"]([^'"]+)['"]/i) || 
                   line.match(/require\(\s*['"]([^'"]+)['"]\s*\)/i);

// Layer check
if (filePath.includes('domain/') && importPath.includes('infrastructure/')) {
  // VIOLATION: Domain importing infrastructure
}
```

## Common Pitfalls

1. **Circular context detection** — Don't recurse into `node_modules`, `.git`, `dist`, `build`
2. **Empty layers** — Return empty array, not null
3. **File encoding** — Assume UTF-8, skip binary files
4. **Relative paths** — Use `path.relative(projectPath, file)` for display

## Testing a New Implementation

1. Create minimal DDD project:
```bash
mkdir test-ddd
cd test-ddd
mkdir -p src/{domain/user,application/user,infrastructure/persistence}
touch src/domain/user/User.ts src/domain/user/UserRepository.ts
touch src/application/user/CreateUserUseCase.ts  # importa infra DE propósito (violação)
touch src/infrastructure/persistence/PrismaUserRepository.ts
```

2. Run validator:
```bash
node validate-ddd.js . --visual
```

3. Verify:
   - Detects framework correctly
   - Finds 3+ layers
   - Detects the infra violation in use case
   - Generates all 7 files in `./docs/`
   - `INDEX.md` has working links
