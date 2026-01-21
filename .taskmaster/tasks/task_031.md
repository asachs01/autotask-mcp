# Task ID: 31

**Title:** Namespace All MCP Tools with 'autotask_' Prefix

**Status:** pending

**Dependencies:** None

**Priority:** high

**Description:** Refactor all 35 MCP tools to use 'autotask_' namespace prefix to prevent tool name collisions when multiple MCP servers are connected.

**Details:**

**Problem:**
Current tool names like `search_companies`, `create_ticket` are generic and will collide with other MCP servers that have similar tools (e.g., Salesforce MCP, Jira MCP).

**Solution:**
Add `autotask_` namespace prefix to all tools:
- `search_companies` → `autotask_search_companies`
- `create_ticket` → `autotask_create_ticket`
- `test_connection` → `autotask_test_connection`
- etc.

**Implementation:**
1. Update tool definitions in `src/handlers/tool.handler.ts`
2. Update tool call handler to use new names
3. **Backwards Compatibility Option A (v1.4.0)**: Keep old names as aliases, emit deprecation warning
4. **Backwards Compatibility Option B (v2.0.0)**: Remove old names, document breaking change
5. Update all documentation and examples
6. Update tests to use new tool names

**Files to Modify:**
- `src/handlers/tool.handler.ts` - Tool definitions (35 tools)
- `src/mcp/server.ts` - Tool call routing
- `tests/*.test.ts` - All test files
- `README.md`, `QUICK_START_CLAUDE.md` - Documentation
- `CHANGELOG.md` - Document change

**Naming Convention:**
```
autotask_<entity>_<action>
autotask_company_search
autotask_company_create
autotask_ticket_search
autotask_ticket_create
autotask_time_entry_create
autotask_resource_search
autotask_connection_test
```

Alternatively, simpler flat namespace:
```
autotask_search_companies
autotask_create_company
autotask_search_tickets
```

**Test Strategy:**

1. Verify all 35 tools have autotask_ prefix. 2. Test tool calls work with new names. 3. If backwards compat: test old names still work with deprecation warning. 4. Test Claude Desktop integration with namespaced tools. 5. Grep for old tool names in codebase - should be zero (except aliases). 6. Update and run full test suite.
