#!/usr/bin/env node
// Deploy script — Phase 7 Polish & Testing
// Builds static site to dist/ and validates for GitHub Pages / Netlify
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';

console.log('→ Building 聽日辭職...');
execSync('npm run build', { stdio: 'inherit' });

if (!existsSync('dist/index.html')) {
  console.error('✗ dist/index.html missing — build failed');
  process.exit(1);
}
console.log('✓ dist generated');

console.log('→ Validating offline cache...');
if (!existsSync('dist/sw.js')) console.warn('⚠ sw.js missing — check public/sw.js');
if (!existsSync('dist/manifest.json')) console.warn('⚠ manifest.json missing');

console.log('→ Checking bundle size...');
try {
  const stats = execSync('du -sh dist 2>/dev/null || dir /-C dist | findstr "File(s)"', { encoding: 'utf-8' });
  console.log(stats.trim());
} catch {}

console.log('\n✓ Ready to deploy:');
console.log('  - GitHub Pages: git add dist & push to gh-pages, or Netlify drag dist/');
console.log('  - Preview: npm run preview -- --port 4173');
console.log('  - PWA: verify sw.js cache cc-v1 in DevTools > Application');
