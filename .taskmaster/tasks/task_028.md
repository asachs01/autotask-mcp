# Task ID: 28

**Title:** Implement MCP Lazy Loading / Progressive Tool Discovery

**Status:** pending

**Dependencies:** 25 ✓

**Priority:** medium

**Description:** Add lazy loading support for MCP tools to reduce context overhead. Currently 35 tools are loaded upfront which consumes significant context tokens. Implement progressive discovery pattern.

**Details:**

The autotask-mcp server exposes 35 tools which creates context overhead when all tool schemas are loaded upfront. Implement lazy loading using one of two approaches:

**Option A: Server-Side Progressive Discovery (Recommended)**
Implement a three-tool meta-interface inspired by mcp-dynamic-proxy and modern MCP patterns like MCP-Zero and progressive disclosure:
1. `autotask_list_categories` - Returns tool categories (Companies, Contacts, Tickets, TimeEntries, Resources, Utility) without full schemas
2. `autotask_list_tools` - Returns tools for a specific category with full JSON schemas
3. `autotask_execute_tool` - Proxies execution to the actual tool

This reduces initial context from 35 tools to 3 tools (97% reduction).

**Option B: Client-Side Compatibility**
Ensure compatibility with Claude Code's built-in MCP Tool Search feature which auto-detects when tools exceed 10% context and switches to on-demand discovery.

**Implementation Steps:**
1. Add tool categorization metadata to existing tools (leverage completed company/contact tools from Tasks 10/11)
2. Create meta-tools for progressive discovery
3. Add CLI flag `--lazy-loading` to enable/disable
4. Update tool handler to support both modes
5. Add documentation for lazy loading configuration
6. Benchmark token usage before/after[1][2][3][4]

**Test Strategy:**

1. Measure baseline token usage with all 35 tools loaded. 2. Implement lazy loading and measure reduced token usage. 3. Test tool discovery flow: list_categories -> list_tools -> execute_tool. 4. Verify backward compatibility - existing direct tool calls still work (test with completed Tasks 10/11 tools). 5. Test with Claude Code MCP Tool Search enabled. 6. Performance benchmark: response time for tool discovery vs direct call.
