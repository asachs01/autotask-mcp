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

// Dynamic import ensures the guard is active before module resolution
import('./index.js').catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
