#!/usr/bin/env node
/**
 * DDD Architecture Validator
 * Validates Domain-Driven Design patterns across multiple languages
 * 
 * Usage:
 *   node validate-ddd.js <path> [options]
 *   
 * Options:
 *   --visual          Generate HTML visualization
 *   --json            Output JSON (for CI/CD)
 *   --watch           Watch mode (re-run on file changes)
 *   --config=<file>   Use custom config file (default: .dddrc.json)
 *   --silent          No console output (use with --json)
 *   --strict          Fail on any violation (exit code 1)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Try to load chokidar for watch mode
let chokidar;
try {
  chokidar = require('chokidar');
} catch {
  // Optional dependency
}

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const c = colors;

// Parse arguments
const args = process.argv.slice(2);
const targetPath = args.find(a => !a.startsWith('--')) || '.';
const options = {
  visual: args.includes('--visual'),
  json: args.includes('--json'),
  watch: args.includes('--watch'),
  config: args.find(a => a.startsWith('--config='))?.split('=')[1] || '.dddrc.json',
  silent: args.includes('--silent'),
  strict: args.includes('--strict'),
  help: args.includes('--help') || args.includes('-h')
};

// Help
if (options.help) {
  console.log(`
${c.bright}DDD Architecture Validator${c.reset}

Usage: node validate-ddd.js <path> [options]

Options:
  --visual          Generate interactive HTML report
  --json            Output results as JSON
  --watch           Watch mode: re-run on file changes
  --config=<file>   Config file path (default: .dddrc.json)
  --silent          Suppress console output
  --strict          Exit with code 1 if any violations found
  -h, --help        Show this help

Examples:
  node validate-ddd.js . --visual              # Validate with HTML output
  node validate-ddd.js . --json > report.json  # JSON for CI/CD
  node validate-ddd.js . --watch --visual        # Watch mode with visual
  node validate-ddd.js src --strict            # Fail on violations
`);
  process.exit(0);
}

if (!options.silent) {
  console.log(`\n${c.cyan}${c.bright}🔍 DDD Architecture Validator${c.reset}\n`);
}

// Language detection patterns
const patterns = {
  typescript: {
    extensions: ['.ts', '.tsx'],
    entity: /class\s+\w+.*\{[\s\S]*?\}/g,
    valueObject: /class\s+\w+(?:Id|Email|Money|Address|Name)/i,
    repository: /(?:interface|class)\s+\w*Repository/i,
    domainEvent: /(?:interface|class)\s+\w*Event\s*[\{\|]/i,
    service: /class\s+\w+Service/i,
    module: /module\s*\{/i,
    layerPatterns: {
      domain: /[\\/]domain[\\/]|[\\/]entities[\\/]|[\\/]models[\\/]/i,
      application: /[\\/]application[\\/]|[\\/]use[\-_]?cases?[\\/]|[\\/]services[\\/]/i,
      infrastructure: /[\\/]infrastructure[\\/]|[\\/]infra[\\/]|[\\/]data[\\/]/i,
      interfaces: /[\\/]interfaces[\\/]|[\\/]api[\\/]|[\\/]controllers?[\\/]|[\\/]presentation[\\/]/i
    }
  },
  javascript: {
    extensions: ['.js', '.jsx', '.mjs'],
    entity: /class\s+\w+|exports\.[\w]+\s*=/,
    valueObject: /class\s+\w+(?:Id|Email|Money|Address)/i,
    repository: /class\s+\w*Repository|\w*Repository\s*=/i,
    domainEvent: /class\s+\w*Event|\w*Event\s*=/i,
    service: /class\s+\w+Service|\w+Service\s*=/i,
    module: /module\.exports|exports\./i,
    layerPatterns: {
      domain: /[\\/]domain[\\/]|[\\/]entities[\\/]/i,
      application: /[\\/]application[\\/]|[\\/]use[\-_]?cases?[\\/]/i,
      infrastructure: /[\\/]infrastructure[\\/]|[\\/]infra[\\/]/i,
      interfaces: /[\\/]interfaces[\\/]|[\\/]api[\\/]|[\\/]controllers?[\\/]/i
    }
  },
  python: {
    extensions: ['.py'],
    entity: /class\s+\w+[^:]*:/,
    valueObject: /@dataclass|class\s+\w+(?:Id|Value)/i,
    repository: /class\s+\w*Repository|def\s+\w*repository/i,
    domainEvent: /class\s+\w*Event\(|@dataclass/, 
    service: /class\s+\w*Service:/i,
    module: /^(?:(?:from|import)\s+\w+|__all__\s*=)/m,
    layerPatterns: {
      domain: /[\\/]domain[\\/]/i,
      application: /[\\/]application[\\/]|[\\/]use_cases[\\/]/i,
      infrastructure: /[\\/]infrastructure[\\/]|[\\/]infra[\\/]/i,
      interfaces: /[\\/]interfaces[\\/]|[\\/]api[\\/]/i
    }
  },
  java: {
    extensions: ['.java'],
    entity: /@Entity|class\s+\w+\s*\{/,
    valueObject: /@ValueObject|class\s+\w+(?:Id|Value)/i,
    repository: /@Repository|interface\s+\w*Repository/i,
    domainEvent: /@DomainEvent|class\s+\w*Event/i,
    service: /@Service|class\s+\w+Service/i,
    module: /@Module|@SpringBootApplication/i,
    layerPatterns: {
      domain: /[\\/]domain[\\/]|[\\/]model[\\/]/i,
      application: /[\\/]application[\\/]|[\\/]service[\\/]/i,
      infrastructure: /[\\/]infrastructure[\\/]|[\\/]repository[\\/]/i,
      interfaces: /[\\/]interfaces?[\\/]|[\\/]controller[\\/]|[\\/]web[\\/]/i
    }
  }
};

// Default config
const defaultConfig = {
  rules: {
    domainLayer: { enabled: true, required: true },
    applicationLayer: { enabled: true, required: true },
    infrastructureLayer: { enabled: true, required: false },
    interfacesLayer: { enabled: true, required: false },
    entities: { enabled: true, required: true },
    valueObjects: { enabled: true, required: false },
    domainServices: { enabled: true, required: false },
    repositories: { enabled: true, required: true, interfaceOnly: true },
    domainEvents: { enabled: true, required: false },
    applicationServices: { enabled: true, required: false },
    dto: { enabled: true, required: false },
    crossDomainDeps: { enabled: true, allowed: false }
  },
  exclude: [
    'node_modules', 'dist', 'build', '.git', '__pycache__',
    'target', 'out', '*.test.*', '*.spec.*', 'vendor'
  ],
  output: { format: 'console', colors: true, verbose: false }
};

// Load user config
function loadConfig(configPath) {
  if (!fs.existsSync(configPath)) {
    return defaultConfig;
  }
  try {
    const userConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    return { ...defaultConfig, ...userConfig, rules: { ...defaultConfig.rules, ...userConfig.rules } };
  } catch (e) {
    if (!options.silent) console.log(`${c.yellow}⚠ Invalid config file, using defaults${c.reset}`);
    return defaultConfig;
  }
}

const config = loadConfig(options.config);

// Detect language
function detectLanguage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  for (const [lang, p] of Object.entries(patterns)) {
    if (p.extensions.includes(ext)) return lang;
  }
  return null;
}

// Find files
function findFiles(dir, exclude = []) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      if (!exclude.some(e => item.includes(e) || fullPath.includes(e))) {
        files.push(...findFiles(fullPath, exclude));
      }
    } else if (!exclude.some(e => item.includes(e) || fullPath.includes(e))) {
      const lang = detectLanguage(fullPath);
      if (lang) files.push({ path: fullPath, language: lang });
    }
  }
  
  return files;
}

// Analyze file
function analyzeFile(fileObj) {
  const content = fs.readFileSync(fileObj.path, 'utf8');
  const lang = patterns[fileObj.language];
  const result = {
    path: fileObj.path,
    language: fileObj.language,
    patterns: {},
    layers: {}
  };
  
  // Check patterns
  for (const [name, regex] of Object.entries(lang)) {
    if (name !== 'layerPatterns' && name !== 'extensions') {
      result.patterns[name] = regex.test(content);
    }
  }
  
  // Check layers
  if (lang.layerPatterns) {
    for (const [layer, regex] of Object.entries(lang.layerPatterns)) {
      if (regex.test(fileObj.path)) {
        result.layers[layer] = true;
      }
    }
  }
  
  return result;
}

// Validate against rules
function validate(results) {
  const violations = [];
  const stats = {
    totalFiles: results.length,
    byLanguage: {},
    layers: {},
    patterns: {}
  };
  
  // Count stats
  for (const r of results) {
    stats.byLanguage[r.language] = (stats.byLanguage[r.language] || 0) + 1;
    
    for (const [layer] of Object.entries(r.layers)) {
      stats.layers[layer] = (stats.layers[layer] || 0) + 1;
    }
    
    for (const [pattern, found] of Object.entries(r.patterns)) {
      if (found) {
        stats.patterns[pattern] = (stats.patterns[pattern] || 0) + 1;
      }
    }
  }
  
  // Check rules
  if (config.rules.domainLayer.required && !stats.layers.domain) {
    violations.push({ type: 'missing', message: 'Domain layer not found', severity: 'error' });
  }
  
  if (config.rules.applicationLayer.required && !stats.layers.application) {
    violations.push({ type: 'missing', message: 'Application layer not found', severity: 'error' });
  }
  
  if (config.rules.entities.required && !stats.patterns.entity) {
    violations.push({ type: 'missing', message: 'No entities found', severity: 'error' });
  }
  
  if (config.rules.repositories.required && !stats.patterns.repository) {
    violations.push({ type: 'missing', message: 'No repositories found', severity: 'error' });
  }
  
  return { violations, stats };
}

// Generate HTML report
function generateHTML(results, validation) {
  const now = new Date().toISOString();
  const timestamp = new Date().toLocaleString();
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DDD Validation Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; background: #0f172a; color: #e2e8f0; padding: 20px; }
    .header { text-align: center; margin-bottom: 30px; }
    .header h1 { color: #38bdf8; margin-bottom: 10px; }
    .header .timestamp { color: #64748b; font-size: 14px; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px; }
    .stat-card { background: #1e293b; padding: 20px; border-radius: 8px; border-left: 4px solid #38bdf8; }
    .stat-card.error { border-color: #ef4444; }
    .stat-card.success { border-color: #22c55e; }
    .stat-card.warning { border-color: #eab308; }
    .stat-value { font-size: 32px; font-weight: bold; color: #38bdf8; }
    .stat-label { color: #94a3b8; margin-top: 5px; }
    .section { background: #1e293b; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
    .section h2 { color: #38bdf8; margin-bottom: 15px; font-size: 18px; }
    .file-list { list-style: none; }
    .file-item { padding: 10px; border-bottom: 1px solid #334155; }
    .file-item:last-child { border-bottom: none; }
    .file-path { font-family: monospace; color: #38bdf8; }
    .file-meta { font-size: 12px; color: #64748b; margin-top: 5px; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; margin-right: 5px; }
    .badge-entity { background: #8b5cf6; }
    .badge-vo { background: #f59e0b; }
    .badge-repo { background: #10b981; }
    .badge-event { background: #ec4899; }
    .badge-service { background: #3b82f6; }
    .violation { background: #450a0a; border-left: 4px solid #ef4444; padding: 15px; margin-bottom: 10px; border-radius: 4px; }
    .violation.error { background: #450a0a; }
    .violation.warning { background: #422006; border-color: #eab308; }
    .layer-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; }
    .layer-box { background: #0f172a; padding: 20px; border-radius: 8px; text-align: center; border: 2px solid #334155; }
    .layer-box.active { border-color: #22c55e; background: #064e3b; }
    .layer-box.missing { border-color: #ef4444; background: #450a0a; }
    .layer-name { font-weight: bold; margin-bottom: 5px; }
    .layer-count { font-size: 24px; color: #38bdf8; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🏗️ DDD Architecture Report</h1>
    <div class="timestamp">Generated: ${timestamp}</div>
  </div>
  
  <div class="stats">
    <div class="stat-card">
      <div class="stat-value">${validation.stats.totalFiles}</div>
      <div class="stat-label">Files Analyzed</div>
    </div>
    <div class="stat-card ${validation.violations.length > 0 ? 'error' : 'success'}">
      <div class="stat-value">${validation.violations.length}</div>
      <div class="stat-label">Violations</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${Object.keys(validation.stats.byLanguage).length}</div>
      <div class="stat-label">Languages</div>
    </div>
    ${Object.entries(validation.stats.byLanguage).map(([lang, count]) => `
    <div class="stat-card">
      <div class="stat-value">${count}</div>
      <div class="stat-label">${lang.charAt(0).toUpperCase() + lang.slice(1)}</div>
    </div>
    `).join('')}
  </div>
  
  <div class="section">
    <h2>🏛️ Architecture Layers</h2>
    <div class="layer-grid">
      ${['domain', 'application', 'infrastructure', 'interfaces'].map(layer => {
        const count = validation.stats.layers[layer] || 0;
        return `
        <div class="layer-box ${count > 0 ? 'active' : 'missing'}">
          <div class="layer-name">${layer.charAt(0).toUpperCase() + layer.slice(1)}</div>
          <div class="layer-count">${count}</div>
          <div style="font-size: 12px; color: #64748b;">files</div>
        </div>
        `;
      }).join('')}
    </div>
  </div>
  
  ${validation.violations.length > 0 ? `
  <div class="section">
    <h2>⚠️ Violations</h2>
    ${validation.violations.map(v => `
    <div class="violation ${v.severity}">
      <strong>${v.severity.toUpperCase()}:</strong> ${v.message}
    </div>
    `).join('')}
  </div>
  ` : `
  <div class="section">
    <h2>✅ No Violations Found</h2>
    <p style="color: #22c55e;">Your codebase follows DDD best practices!</p>
  </div>
  `}
  
  <div class="section">
    <h2>📁 Files by Layer</h2>
    <ul class="file-list">
      ${results.map(r => `
      <li class="file-item">
        <div class="file-path">${r.path}</div>
        <div class="file-meta">
          <span class="badge">${r.language}</span>
          ${Object.entries(r.layers).map(([l]) => `<span class="badge">${l}</span>`).join('')}
          ${Object.entries(r.patterns).filter(([,v]) => v).slice(0, 5).map(([p]) => `<span class="badge badge-${p}">${p}</span>`).join('')}
        </div>
      </li>
      `).join('')}
    </ul>
  </div>
</body>
</html>`;
}

// Main validation
function runValidation() {
  const absPath = path.resolve(targetPath);
  
  if (!fs.existsSync(absPath)) {
    if (options.json) {
      console.log(JSON.stringify({ error: 'Path not found', path: absPath }));
    } else {
      console.log(`${c.red}✗ Path not found: ${absPath}${c.reset}`);
    }
    process.exit(1);
  }
  
  if (!options.silent) {
    console.log(`${c.dim}Analyzing: ${absPath}${c.reset}`);
    console.log(`${c.dim}Config: ${options.config}${c.reset}\n`);
  }
  
  const files = fs.statSync(absPath).isDirectory() 
    ? findFiles(absPath, config.exclude)
    : [{ path: absPath, language: detectLanguage(absPath) }].filter(f => f.language);
  
  if (files.length === 0) {
    const error = { error: 'No source files found', path: absPath };
    if (options.json) console.log(JSON.stringify(error));
    else if (!options.silent) console.log(`${c.yellow}⚠ No source files found${c.reset}`);
    process.exit(0);
  }
  
  const results = files.map(analyzeFile);
  const validation = validate(results);
  
  // JSON output
  if (options.json) {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      path: absPath,
      stats: validation.stats,
      violations: validation.violations,
      files: results.map(r => ({
        path: r.path,
        language: r.language,
        patterns: r.patterns,
        layers: Object.keys(r.layers)
      }))
    }, null, 2));
  }
  
  // Visual output
  if (options.visual) {
    const html = generateHTML(results, validation);
    const outputPath = path.join(process.cwd(), 'ddd-report.html');
    fs.writeFileSync(outputPath, html);
    if (!options.silent) console.log(`${c.green}✓ Report saved: ${outputPath}${c.reset}`);
  }
  
  // Console output
  if (!options.json && !options.silent) {
    console.log(`${c.cyan}📊 Statistics${c.reset}`);
    console.log(`  Files analyzed: ${c.bright}${validation.stats.totalFiles}${c.reset}`);
    console.log(`  Languages: ${Object.keys(validation.stats.byLanguage).join(', ')}`);
    
    console.log(`\n${c.cyan}🏛️ Layers${c.reset}`);
    for (const [layer, count] of Object.entries(validation.stats.layers)) {
      const color = count > 0 ? c.green : c.yellow;
      console.log(`  ${layer}: ${color}${count} files${c.reset}`);
    }
    
    console.log(`\n${c.cyan}🎯 Patterns Detected${c.reset}`);
    for (const [pattern, count] of Object.entries(validation.stats.patterns)) {
      console.log(`  ${pattern}: ${c.green}${count}${c.reset}`);
    }
    
    console.log(`\n${c.cyan}⚠️ Violations${c.reset}`);
    if (validation.violations.length === 0) {
      console.log(`  ${c.green}✓ None!${c.reset}`);
    } else {
      for (const v of validation.violations) {
        const color = v.severity === 'error' ? c.red : c.yellow;
        console.log(`  ${color}• ${v.message}${c.reset}`);
      }
    }
    
    console.log(`\n${c.dim}Use --visual for detailed HTML report${c.reset}`);
  }
  
  // Exit code
  if (options.strict && validation.violations.length > 0) {
    process.exit(1);
  }
  
  return { results, validation };
}

// Watch mode
if (options.watch) {
  if (!chokidar) {
    if (!options.silent) console.log(`${c.yellow}⚠ Watch mode requires chokidar. Run: npm install chokidar${c.reset}`);
    process.exit(1);
  }
  
  if (!options.silent) console.log(`${c.cyan}👁️ Watch mode enabled. Press Ctrl+C to exit.${c.reset}\n`);
  
  runValidation();
  
  const watcher = chokidar.watch(targetPath, {
    ignored: config.exclude,
    ignoreInitial: true,
    persistent: true
  });
  
  let debounceTimer = null;
  
  watcher.on('change', () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      if (!options.silent) console.log(`\n${c.dim}--- File changed, re-running validation ---${c.reset}\n`);
      runValidation();
    }, 500);
  });
  
  process.on('SIGINT', () => {
    watcher.close().then(() => {
      if (!options.silent) console.log(`\n${c.cyan}👋 Goodbye!${c.reset}`);
      process.exit(0);
    });
  });
} else {
  runValidation();
}
