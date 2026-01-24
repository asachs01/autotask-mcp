---
title: Installation
description: How to install and set up the Autotask MCP Server.
---

## Prerequisites

- Node.js 18 or later
- An Autotask PSA account with API access
- An API user configured in Autotask (Admin → Resources → API Users)

## Install via npx (Recommended)

The simplest way to use the server is with `npx` in your MCP client configuration:

```json
{
  "mcpServers": {
    "autotask-mcp": {
      "command": "npx",
      "args": ["-y", "autotask-mcp"],
      "env": {
        "AUTOTASK_USERNAME": "your-api-user@example.com",
        "AUTOTASK_SECRET": "your-api-secret",
        "AUTOTASK_INTEGRATION_CODE": "your-integration-code"
      }
    }
  }
}
```

## Install from source

```bash
git clone https://github.com/asachs01/autotask-mcp.git
cd autotask-mcp
npm install
npm run build
```

Then configure your MCP client to point at the built output:

```json
{
  "mcpServers": {
    "autotask-mcp": {
      "command": "node",
      "args": ["/path/to/autotask-mcp/dist/entry.js"],
      "env": {
        "AUTOTASK_USERNAME": "your-api-user@example.com",
        "AUTOTASK_SECRET": "your-api-secret",
        "AUTOTASK_INTEGRATION_CODE": "your-integration-code"
      }
    }
  }
}
```

## Verify the Installation

After configuring, ask your AI assistant:

> "Test the Autotask connection"

You should receive a confirmation that the connection is working.

## Using the MCPB Bundle

For single-file deployment, a pre-bundled version is available:

```json
{
  "mcpServers": {
    "autotask-mcp": {
      "command": "node",
      "args": ["/path/to/autotask-mcp-bundle.js"],
      "env": {
        "AUTOTASK_USERNAME": "your-api-user@example.com",
        "AUTOTASK_SECRET": "your-api-secret",
        "AUTOTASK_INTEGRATION_CODE": "your-integration-code"
      }
    }
  }
}
```

Build the bundle with:

```bash
node scripts/pack-mcpb.js
```

## Next Steps

- [Configure credentials and options](/getting-started/configuration/)
