#!/usr/bin/env node

/**
 * MCPB Test Harness - simulates Claude Desktop running an MCPB extension.
 *
 * Usage:
 *   node scripts/test-mcpb.js [tool_name] [args_json]
 *   node scripts/test-mcpb.js autotask_search_companies '{"pageSize":5}'
 *   node scripts/test-mcpb.js autotask_search_projects '{"pageSize":5}'
 *   node scripts/test-mcpb.js --list-tools
 */

const { spawn, execSync } = require('child_process');
const { readFileSync, existsSync, rmSync, mkdirSync } = require('fs');
const { resolve, join } = require('path');

const ROOT = resolve(__dirname, '..');
const BUNDLE = join(ROOT, 'autotask-mcp.mcpb');
const EXTRACT_DIR = join(ROOT, '.mcpb-test-extract');

function loadEnv() {
  const content = readFileSync(join(ROOT, '.env'), 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq === -1) continue;
    const k = t.slice(0, eq).trim();
    let v = t.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    env[k] = v;
  }
  return env;
}

async function main() {
  const listOnly = process.argv.includes('--list-tools');
  const testTool = listOnly ? null : (process.argv[2] || 'autotask_test_connection');
  const testArgs = process.argv[3] ? JSON.parse(process.argv[3]) : {};

  console.log('=== MCPB Test Harness ===\n');

  if (!existsSync(BUNDLE)) {
    console.error('Bundle not found. Run: npm run pack:mcpb');
    process.exit(1);
  }

  // Extract
  if (existsSync(EXTRACT_DIR)) rmSync(EXTRACT_DIR, { recursive: true });
  mkdirSync(EXTRACT_DIR, { recursive: true });
  execSync(`unzip -q "${BUNDLE}" -d "${EXTRACT_DIR}"`);

  // Read manifest
  const manifest = JSON.parse(readFileSync(join(EXTRACT_DIR, 'manifest.json'), 'utf8'));
  console.log(`${manifest.display_name} v${manifest.version}`);

  // Verify entry point
  const entryPoint = join(EXTRACT_DIR, manifest.server.entry_point);
  if (!existsSync(entryPoint)) {
    console.error(`Entry point missing: ${manifest.server.entry_point}`);
    process.exit(1);
  }

  // Load creds
  const dotenv = loadEnv();
  const env = {
    ...process.env,
    AUTOTASK_USERNAME: dotenv.AUTOTASK_USERNAME,
    AUTOTASK_SECRET: dotenv.AUTOTASK_SECRET,
    AUTOTASK_INTEGRATION_CODE: dotenv.AUTOTASK_INTEGRATION_CODE,
    MCP_TRANSPORT: 'stdio',
    NODE_ENV: 'production',
  };

  if (!env.AUTOTASK_USERNAME) {
    console.error('Missing credentials in .env');
    process.exit(1);
  }

  // Spawn server
  const proc = spawn('node', [entryPoint], { env, cwd: EXTRACT_DIR, stdio: ['pipe', 'pipe', 'pipe'] });
  let stderr = '';
  proc.stderr.on('data', d => { stderr += d.toString(); });

  // NDJSON message handling (MCP SDK v1.18.x uses newline-delimited JSON)
  const pending = new Map();
  let nextId = 1;
  let buffer = '';

  proc.stdout.on('data', chunk => {
    buffer += chunk.toString();
    const lines = buffer.split('\n');
    buffer = lines.pop(); // keep incomplete line
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const msg = JSON.parse(line);
        if (msg.id !== undefined && pending.has(msg.id)) {
          pending.get(msg.id).resolve(msg);
        }
      } catch (e) {
        console.error('Parse error:', line.slice(0, 100));
      }
    }
  });

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = nextId++;
      const msg = JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n';
      pending.set(id, { resolve, reject });
      proc.stdin.write(msg);
      setTimeout(() => {
        if (pending.has(id)) {
          pending.delete(id);
          reject(new Error(`Timeout: ${method} (30s)`));
        }
      }, 30000);
    });
  }

  function notify(method, params = {}) {
    proc.stdin.write(JSON.stringify({ jsonrpc: '2.0', method, params }) + '\n');
  }

  try {
    await new Promise(r => setTimeout(r, 1500));

    // Initialize
    console.log('\n[1] Initialize...');
    const init = await send('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'mcpb-test', version: '1.0.0' }
    });
    if (init.error) throw new Error('Init failed: ' + JSON.stringify(init.error));
    console.log(`    Server: ${init.result.serverInfo.name} v${init.result.serverInfo.version}`);

    notify('notifications/initialized');
    await new Promise(r => setTimeout(r, 300));

    // List tools
    console.log('[2] List tools...');
    const tools = await send('tools/list', {});
    if (tools.error) throw new Error('tools/list failed: ' + JSON.stringify(tools.error));
    const toolList = tools.result.tools || [];
    console.log(`    Found ${toolList.length} tools`);

    if (listOnly) {
      toolList.forEach(t => console.log(`    - ${t.name}: ${(t.description || '').slice(0, 60)}`));
      console.log('\n=== PASS ===');
      return;
    }

    // Verify requested tool exists
    const toolExists = toolList.some(t => t.name === testTool);
    if (!toolExists) {
      console.error(`    Tool "${testTool}" not found in server`);
      process.exit(1);
    }

    // Call tool
    console.log(`[3] Call ${testTool}(${JSON.stringify(testArgs)})...`);
    const result = await send('tools/call', { name: testTool, arguments: testArgs });

    if (result.error) {
      console.error(`\n    FAIL: ${JSON.stringify(result.error)}`);
      process.exit(1);
    }

    const content = result.result.content || [];
    let success = true;
    for (const block of content) {
      if (block.type === 'text') {
        try {
          const parsed = JSON.parse(block.text);
          if (parsed.error) {
            console.error(`\n    API ERROR: ${parsed.error}`);
            success = false;
          } else if (parsed.results) {
            console.log(`    Got ${parsed.results.length} results`);
            if (parsed.results[0]) {
              const first = parsed.results[0];
              const preview = Object.entries(first).slice(0, 4).map(([k, v]) => `${k}=${v}`).join(', ');
              console.log(`    First: ${preview}`);
            }
          } else if (parsed.success !== undefined) {
            console.log(`    Success: ${parsed.success}`);
            if (parsed.message) console.log(`    Message: ${parsed.message}`);
          } else {
            console.log('    Response:', JSON.stringify(parsed).slice(0, 200));
          }
        } catch {
          console.log('    Response:', block.text.slice(0, 200));
        }
      }
    }

    console.log(success ? '\n=== PASS ===' : '\n=== FAIL ===');
    process.exitCode = success ? 0 : 1;

  } catch (err) {
    console.error(`\n    ERROR: ${err.message}`);
    if (stderr.includes('[ERROR]')) {
      const errors = stderr.split('\n').filter(l => l.includes('[ERROR]'));
      errors.slice(-3).forEach(e => console.error('    ' + e.slice(0, 200)));
    }
    process.exitCode = 1;
  } finally {
    proc.kill('SIGTERM');
    await new Promise(r => setTimeout(r, 500));
    rmSync(EXTRACT_DIR, { recursive: true, force: true });
  }
}

main().catch(err => {
  console.error('Fatal:', err);
  if (existsSync(EXTRACT_DIR)) rmSync(EXTRACT_DIR, { recursive: true, force: true });
  process.exit(1);
});
