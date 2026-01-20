# Task ID: 8

**Title:** Implement MCP Server Core

**Status:** pending

**Dependencies:** 7

**Priority:** high

**Description:** Create the main MCP server implementation with protocol compliance and request routing

**Details:**

Create mcp-server.ts in mcp/ directory implementing MCP protocol. Handle initialize, list_resources, list_tools, call_tool, read_resource requests. Set up proper JSON-RPC 2.0 message handling with error responses. Include server capabilities declaration and version negotiation. Use @modelcontextprotocol/sdk if available or implement protocol manually.

**Test Strategy:**

Test MCP protocol compliance, message parsing/serialization, error handling for malformed requests
