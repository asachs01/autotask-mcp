#!/usr/bin/env node

/**
 * Pack script for creating MCPB (MCP Bundle) distribution.
 * Creates a clean staging directory with only production deps,
 * then runs mcpb pack to create the bundle.
 */

const { execSync } = require('child_process');
const { cpSync, mkdirSync, rmSync, existsSync, copyFileSync } = require('fs');
const { resolve, join } = require('path');

const ROOT = resolve(__dirname, '..');
const STAGING = resolve(ROOT, '.mcpb-staging');

function run(cmd, opts = {}) {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: 'inherit', ...opts });
}

try {
  // 1. Build the project
  console.log('\n=== Building project ===');
  run('npm run build', { cwd: ROOT });

  // 2. Clean and create staging directory
  console.log('\n=== Preparing staging directory ===');
  if (existsSync(STAGING)) rmSync(STAGING, { recursive: true });
  mkdirSync(STAGING, { recursive: true });

  // 3. Copy production files
  console.log('\n=== Copying production files ===');
  cpSync(join(ROOT, 'dist'), join(STAGING, 'dist'), { recursive: true });
  copyFileSync(join(ROOT, 'manifest.json'), join(STAGING, 'manifest.json'));
  copyFileSync(join(ROOT, 'README.md'), join(STAGING, 'README.md'));
  if (existsSync(join(ROOT, 'LICENSE'))) {
    copyFileSync(join(ROOT, 'LICENSE'), join(STAGING, 'LICENSE'));
  }

  // 4. Create a minimal package.json with only production deps
  const pkg = require(join(ROOT, 'package.json'));
  const prodPkg = {
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
    main: pkg.main,
    dependencies: pkg.dependencies,
  };
  require('fs').writeFileSync(
    join(STAGING, 'package.json'),
    JSON.stringify(prodPkg, null, 2)
  );

  // 5. Install production dependencies
  console.log('\n=== Installing production dependencies ===');
  run('npm install --production --ignore-scripts', { cwd: STAGING });

  // 6. Remove source maps from dist
  run('find dist -name "*.map" -delete', { cwd: STAGING });

  // 7. Pack the bundle
  console.log('\n=== Packing MCPB bundle ===');
  const bundlePath = join(ROOT, `${pkg.name}.mcpb`);
  run(`npx mcpb pack "${STAGING}" "${bundlePath}"`, { cwd: ROOT });

  // 8. Cleanup
  console.log('\n=== Cleanup ===');
  rmSync(STAGING, { recursive: true });

  console.log('\n=== Done! ===');
  if (existsSync(bundlePath)) {
    const stats = require('fs').statSync(bundlePath);
    console.log(`Bundle: ${pkg.name}.mcpb (${(stats.size / 1024 / 1024).toFixed(1)}MB)`);
  }
} catch (error) {
  console.error('Pack failed:', error.message);
  if (existsSync(STAGING)) rmSync(STAGING, { recursive: true });
  process.exit(1);
}
