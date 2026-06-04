#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function safeReadDirSync(dir) { try { return fs.readdirSync(dir); } catch { return []; } }
function safeStatSync(f) { try { return fs.statSync(f); } catch { return null; } }

function findFiles(dir, exts, depth) {
  const files=[]; 
  function scan(d, lvl) {
    if (lvl>5) return; if (!fs.existsSync(d)) return;
    const entries = safeReadDirSync(d);
    for (const e of entries) {
      if (e.startsWith('.')||e==='node_modules'||e==='dist'||e==='build') continue;
      const fp=path.join(d,e); const st=safeStatSync(fp); if (!st) continue;
      if (st.isDirectory()) scan(fp,lvl+1);
      else if (st.isFile() && exts.some(x=>fp.endsWith(x))) files.push(fp);
    }
  }
  scan(dir,0); return files;
}

function detectFramework(p) {
  if (fs.existsSync(path.join(p,'pom.xml'))) return 'java-spring';
  if (fs.existsSync(path.join(p,'build.gradle'))) return 'java-spring';
  if (fs.existsSync(path.join(p,'requirements.txt'))) return 'python';
  if (fs.existsSync(path.join(p,'pyproject.toml'))) return 'python';
  const pj=path.join(p,'package.json');
  if (fs.existsSync(pj)) {
    try { const pkg=JSON.parse(fs.readFileSync(pj,'utf8'));
      if (pkg.dependencies?.react||pkg.devDependencies?.react) return 'react';
    } catch {}
    return 'nodejs';
  }
  if (fs.existsSync(path.join(p,'tsconfig.json'))) return 'nodejs';
  return 'nodejs';
}

function scanLayers(p) {
  const exts=['.ts','.tsx','.js','.jsx'];
  const layers={};
  for (const l of ['domain','application','infrastructure','controllers','api']) {
    const sp=path.join(p,'src',l), rp=path.join(p,l);
    if (fs.existsSync(sp)) layers[l+'/']=findFiles(sp,exts);
    else if (fs.existsSync(rp)) layers[l+'/']=findFiles(rp,exts);
  }
  return layers;
}

function detectEntities(files) {
  return files.map(f=>{
    const c=fs.readFileSync(f,'utf8'), b=path.basename(f,path.extname(f));
    let t=null;
    if (f.includes('domain/') && (c.includes('class')||c.includes('interface'))) t='Entity';
    if (f.includes('application/') && c.toLowerCase().includes('use')) t='UseCase';
    return t?{name:b,type:t,rel:path.relative(process.cwd(),f)}:null;
  }).filter(x=>x);
}

function checkViolations(layers) {
  const v=[];
  for (const [n,fz] of Object.entries(layers)) {
    for (const f of fz) {
      const lines=fs.readFileSync(f,'utf8').split('\n');
      lines.forEach((ln,i)=>{
        const m=ln.match(/from\s['"]([^'"]+)['"]/); if (!m) return;
        const imp=m[1];
        if (n.includes('domain') && (imp.includes('infra')||imp.includes('application')))
          v.push({file:f,line:i+1,sev:'ERROR',issue:'Domain imports app/infra',import:imp});
        else if (n.includes('application') && imp.includes('infrastructure'))
          v.push({file:f,line:i+1,sev:'WARNING',issue:'App imports infra',import:imp});
      });
    }
  }
  return v;
}

function generate(projectPath, fw, layers, violations, docPath) {
  if (!fs.existsSync(docPath)) fs.mkdirSync(docPath,{recursive:true});
  const name=path.basename(path.resolve(projectPath));
  const time=new Date().toISOString().split('T')[0];
  const total=Object.values(layers).flat().length;
  const ents=Object.values(layers).flatMap(detectEntities);
  const err=violations.filter(v=>v.sev==='ERROR').length;
  const warn=violations.filter(v=>v.sev==='WARNING').length;
  
  fs.writeFileSync(path.join(docPath,'INDEX.md'), 
    '# '+name+'\n**Generated:** '+time+'\n\n## Quick Links\n- [VALIDATION_REPORT.md](VALIDATION_REPORT.md)\n- [C4_CONTEXT.md](C4_CONTEXT.md)\n'+
    '## Stats\n- Layers: '+Object.keys(layers).length+'\n- Files: '+total+'\n- Entities: '+ents.length+'\n- Errors: '+err+'\n- Warnings: '+warn);
  
  const vtable=violations.length?violations.map(v=>'| '+path.relative(projectPath,v.file)+' | '+v.line+' | '+v.sev+' | '+v.issue+' |').join('\n'):'| - | - | - | - |';
  fs.writeFileSync(path.join(docPath,'VALIDATION_REPORT.md'),
    '# Validation: '+name+'\n\n## Violations\n| File | Line | Severity | Issue |\n|------|------|----------|-------|\n'+vtable);
  
  fs.writeFileSync(path.join(docPath,'C4_CONTEXT.md'),
    '# C4 Context: '+name+'\n```\n[User] --> ['+name+']\n['+name+'] --> [Database]\n```');
  
  fs.writeFileSync(path.join(docPath,'C4_CONTAINERS.md'),
    '# C4 Containers: '+name+'\n\n## Layers\n'+Object.entries(layers).map(([k,fl])=>'### '+k+'\n- '+fl.length+' files').join('\n\n'));
  
  fs.writeFileSync(path.join(docPath,'C4_COMPONENTS.md'),
    '# C4 Components: '+name+'\n\n## Entities\n'+ents.filter(e=>e.type==='Entity').map(e=>'- '+e.name).join('\n'));
  
  fs.writeFileSync(path.join(docPath,'BOUNDED_CONTEXTS.md'),
    '# Bounded Contexts: '+name+'\n\n## Overview\nContexts defined in '+Object.keys(layers).length+' layers.');
  
  const html='<html><head><style>body{font-family:sans-serif;background:#1a1a2e;color:#eee;padding:2rem}'+
    'a{color:#3fb950}</style></head><body><h1>'+name+'</h1><p>Framework: '+fw+' | Generated: '+time+'</p>'+
    '<p>Files: '+total+' | Entities: '+ents.length+' | Errors: '+err+' | Warnings: '+warn+'</p>'+
    '<ul><li><a href="INDEX.md">INDEX.md</a></li>'+
    '<li><a href="VALIDATION_REPORT.md">Validation Report</a></li>'+
    '</ul></body></html>';
  fs.writeFileSync(path.join(docPath,'index.html'),html);
  
  return {docPath,files:['index.html','INDEX.md','C4_CONTEXT.md','C4_CONTAINERS.md','C4_COMPONENTS.md','VALIDATION_REPORT.md','BOUNDED_CONTEXTS.md']};  
}

// MAIN
const args=process.argv.slice(2);
const target=args.find(a=>!a.startsWith('--'))||'.';
const visual=args.includes('--visual');
const strict=args.includes('--strict');
const docOpt=args.find(a=>a.startsWith('--doc='))?.split('=')[1]||'./docs';

console.log('🔍 DDD Architecture Validator');
console.log('─'.repeat(50));

const fw=detectFramework(target);
console.log('📁 Project: '+path.basename(path.resolve(target)));
console.log('🔧 Framework: '+fw);
console.log('─'.repeat(50));

const layers=scanLayers(target);
console.log('📊 Layers found: '+Object.keys(layers).length);
for (const [n,fl] of Object.entries(layers)) console.log('   - '+n+': '+fl.length+' files');

const violations=checkViolations(layers);
const err=violations.filter(v=>v.sev==='ERROR').length;
const warn=violations.filter(v=>v.sev==='WARNING').length;
console.log('⚠️  Violations: '+violations.length+' ('+err+' errors, '+warn+' warnings)');

if (violations.length) {
  console.log('');
  console.log('Detailed violations:');
  violations.forEach(v=>{const r=path.relative(target,v.file);
    console.log('  '+v.sev+': '+r+':'+v.line+' → '+v.issue);});
  console.log('');
  console.log('📝 RECOMENDAÇÃO: Invocar /brainstorming para criar plano de adequação DDD');
}

if (visual) {
  console.log(''); console.log('🎨 Generating documentation...');
  const r=generate(target,fw,layers,violations,docOpt);
  console.log('─'.repeat(50));
  console.log('✅ Generated '+r.files.length+' files:');
  r.files.forEach(f=>console.log('   📄 '+f));
  console.log(''); console.log('📂 Location: '+path.resolve(r.docPath));
  console.log(''); console.log('💡 Read INDEX.md for AI context');
  console.log('🌐 Open index.html for visual');
}

if (strict && err) { console.log(''); console.log('❌ Strict mode: Exiting 1'); process.exit(1); }
console.log(''); console.log('✅ Validation complete');
