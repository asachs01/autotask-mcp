#!/usr/bin/env node

/**
 * MCPB Test Harness - simulates Claude Desktop running an MCPB extension.
 * Runs all tests in a SINGLE server session to avoid API rate limits.
 *
 * Usage:
 *   node scripts/test-mcpb.js              # Run all smoke tests (1 API call)
 *   node scripts/test-mcpb.js --all        # Run full suite (multiple API calls, single session)
 *   node scripts/test-mcpb.js <tool> [json] # Run a single tool test
 *   node scripts/test-mcpb.js --list-tools  # List available tools
 */

const { spawn, execSync } = require('child_process');
const { readFileSync, existsSync, rmSync, mkdirSync } = require('fs');
const { resolve, join } = require('path');

const ROOT = resolve(__dirname, '..');
const BUNDLE = join(ROOT, 'autotask-mcp.mcpb');
const EXTRACT_DIR = join(ROOT, '.mcpb-test-extract');

// Full test suite: all tools tested in a single session
const FULL_SUITE = [
  { name: 'autotask_test_connection', args: {} },
  { name: 'autotask_search_companies', args: { pageSize: 2 } },
  { name: 'autotask_search_tickets', args: { pageSize: 2 } },
  { name: 'autotask_search_projects', args: { pageSize: 2 } },
  { name: 'autotask_search_tasks', args: { pageSize: 2 } },
  { name: 'autotask_search_contacts', args: { pageSize: 2 } },
  { name: 'autotask_list_queues', args: {} },
  { name: 'autotask_list_ticket_statuses', args: {} },
  { name: 'autotask_list_ticket_priorities', args: {} },
];

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

function parseToolResult(content) {
  for (const block of (content || [])) {
    if (block.type === 'text') {
      try {
        const parsed = JSON.parse(block.text);
        if (parsed.error) return { ok: false, summary: parsed.error };
        if (parsed.results) return { ok: true, summary: `${parsed.results.length} results` };
        if (parsed.data && Array.isArray(parsed.data)) return { ok: true, summary: `${parsed.data.length} items` };
        if (parsed.success !== undefined) return { ok: parsed.success, summary: parsed.message || 'ok' };
        return { ok: true, summary: JSON.stringify(parsed).slice(0, 80) };
      } catch {
        return { ok: true, summary: block.text.slice(0, 80) };
      }
    }
  }
  return { ok: false, summary: 'no content' };
}

async function main() {
  const listOnly = process.argv.includes('--list-tools');
  const runAll = process.argv.includes('--all');
  const singleTool = (!listOnly && !runAll && process.argv[2] && !process.argv[2].startsWith('--'))
    ? process.argv[2] : null;
  const singleArgs = singleTool && process.argv[3] ? JSON.parse(process.argv[3]) : {};

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

  // Spawn server (single process for all tests)
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
    buffer = lines.pop();
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
    const init = await send('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'mcpb-test', version: '1.0.0' }
    });
    if (init.error) throw new Error('Init failed: ' + JSON.stringify(init.error));
    console.log(`Server: ${init.result.serverInfo.name} v${init.result.serverInfo.version}`);

    notify('notifications/initialized');
    await new Promise(r => setTimeout(r, 300));

    // List tools
    const tools = await send('tools/list', {});
    if (tools.error) throw new Error('tools/list failed: ' + JSON.stringify(tools.error));
    const toolList = tools.result.tools || [];
    console.log(`Tools: ${toolList.length} registered\n`);

    if (listOnly) {
      toolList.forEach(t => console.log(`  ${t.name}: ${(t.description || '').slice(0, 60)}`));
      console.log('\n=== PASS ===');
      return;
    }

    // Determine which tools to test
    const testsToRun = singleTool
      ? [{ name: singleTool, args: singleArgs }]
      : runAll
        ? FULL_SUITE
        : [{ name: 'autotask_test_connection', args: {} }]; // default: smoke test only

    // Run tests in sequence within the same session
    let passed = 0;
    let failed = 0;
    const results = [];

    for (const test of testsToRun) {
      const toolExists = toolList.some(t => t.name === test.name);
      if (!toolExists) {
        console.log(`  SKIP  ${test.name} (not found)`);
        results.push({ name: test.name, status: 'SKIP' });
        continue;
      }

      try {
        const result = await send('tools/call', { name: test.name, arguments: test.args });

        if (result.error) {
          console.log(`  FAIL  ${test.name}: ${JSON.stringify(result.error).slice(0, 100)}`);
          failed++;
          results.push({ name: test.name, status: 'FAIL', error: result.error });
        } else {
          const { ok, summary } = parseToolResult(result.result.content);
          if (ok) {
            console.log(`  PASS  ${test.name}: ${summary}`);
            passed++;
            results.push({ name: test.name, status: 'PASS', summary });
          } else {
            console.log(`  FAIL  ${test.name}: ${summary}`);
            failed++;
            results.push({ name: test.name, status: 'FAIL', error: summary });
          }
        }
      } catch (err) {
        console.log(`  FAIL  ${test.name}: ${err.message}`);
        failed++;
        results.push({ name: test.name, status: 'FAIL', error: err.message });
      }

      // Small delay between calls to be kind to the API
      if (testsToRun.length > 1) await new Promise(r => setTimeout(r, 500));
    }

    // Summary
    console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed`);
    console.log(failed === 0 ? '\n=== PASS ===' : '\n=== FAIL ===');
    process.exitCode = failed === 0 ? 0 : 1;

  } catch (err) {
    console.error(`\nERROR: ${err.message}`);
    if (stderr.includes('[ERROR]')) {
      const errors = stderr.split('\n').filter(l => l.includes('[ERROR]'));
      errors.slice(-3).forEach(e => console.error('  ' + e.slice(0, 200)));
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
