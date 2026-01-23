#!/usr/bin/env node

// MCP Stdio Guard
// This MUST be the entry point for the MCP server.
// It redirects console.log to stderr before any library code loads,
// preventing stdout pollution (e.g., dotenv v17 in autotask-node)
// from corrupting the MCP JSON-RPC stdio channel.

if (!process.env.MCP_TRANSPORT || process.env.MCP_TRANSPORT === 'stdio') {
  console.log = (...args: unknown[]) => {
    process.stderr.write(
      args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ') + '\n'
    );
  };
}

// Load .env file if present (minimal loader, no external deps)
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
try {
  const envPath = resolve(process.cwd(), '.env');
  const envContent = readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let value = trimmed.slice(eqIdx + 1).trim();
    // Strip surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
} catch {
  // No .env file — that's fine, env vars should be set externally
}

// Dynamic import ensures the guard is active before module resolution
import('./index.js').catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
