---
title: Installation
description: How to install and set up the Autotask MCP Server.
---

## Prerequisites

- Node.js 18 or later
- An Autotask PSA account with API access
- An API user configured in Autotask (Admin → Resources → API Users)

## MCPB Bundle (Recommended)

The fastest way to get started. Download the pre-built bundle from the [latest release](https://github.com/asachs01/autotask-mcp/releases/latest) — it includes all dependencies, so there's no npm install or network fetch needed at runtime.

```bash
mkdir -p ~/.mcp/autotask-mcp
curl -L https://github.com/asachs01/autotask-mcp/releases/latest/download/autotask-mcp.mcpb -o /tmp/autotask-mcp.mcpb
unzip -o /tmp/autotask-mcp.mcpb -d ~/.mcp/autotask-mcp
```

Then configure your MCP client:

```json
{
  "mcpServers": {
    "autotask": {
      "command": "node",
      "args": ["~/.mcp/autotask-mcp/dist/entry.js"],
      "env": {
        "AUTOTASK_USERNAME": "your-api-user@example.com",
        "AUTOTASK_SECRET": "your-api-secret",
        "AUTOTASK_INTEGRATION_CODE": "your-integration-code"
      }
    }
  }
}
```

For Claude Code (CLI):

```bash
claude mcp add autotask-mcp \
  -e AUTOTASK_USERNAME=your-api-user@example.com \
  -e AUTOTASK_SECRET=your-api-secret \
  -e AUTOTASK_INTEGRATION_CODE=your-integration-code \
  -- node ~/.mcp/autotask-mcp/dist/entry.js
```

## Alternative: npx from GitHub

If you prefer not to download a bundle, `npx` installs directly from the GitHub repo on each run:

```json
{
  "mcpServers": {
    "autotask": {
      "command": "npx",
      "args": ["-y", "github:asachs01/autotask-mcp"],
      "env": {
        "AUTOTASK_USERNAME": "your-api-user@example.com",
        "AUTOTASK_SECRET": "your-api-secret",
        "AUTOTASK_INTEGRATION_CODE": "your-integration-code"
      }
    }
  }
}
```

:::note
The npx method fetches and installs dependencies on first run, so the initial startup is slower. The MCPB bundle starts instantly since everything is pre-packaged.
:::

## Alternative: From Source

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
    "autotask": {
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

## Upgrading

To upgrade to a new version, re-download the latest MCPB bundle:

```bash
curl -L https://github.com/asachs01/autotask-mcp/releases/latest/download/autotask-mcp.mcpb -o /tmp/autotask-mcp.mcpb
unzip -o /tmp/autotask-mcp.mcpb -d ~/.mcp/autotask-mcp
```

No config changes needed — the entry point path stays the same.

## Next Steps

- [Configure credentials and options](/autotask-mcp/getting-started/configuration/)
