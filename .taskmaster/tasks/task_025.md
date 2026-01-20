# Task ID: 25

**Title:** Implement HTTP Streamable Transport for MCP Server

**Status:** pending

**Dependencies:** None

**Priority:** medium

**Description:** Add HTTP Streamable transport option to the MCP server for remote access without mcp-proxy (GitHub Issue #7)

**Details:**

Currently the autotask-mcp server only supports stdio transport which requires running on the same machine or using mcp-proxy. Users want HTTP Streamable transport to access the server remotely without additional proxy software. This is a feature request from GitHub Issue #7. Implementation should add an HTTP server mode using the MCP SDK's SSE transport capabilities. Add CLI flag (--http or --transport http) to enable HTTP mode with configurable host and port. Ensure environment variables work correctly in HTTP mode (Docker users report env vars being ignored).

**Test Strategy:**

Test HTTP transport can be started with CLI flags. Verify MCP clients can connect over HTTP. Test environment variables are correctly loaded in HTTP mode. Test Docker deployment with HTTP transport enabled.
