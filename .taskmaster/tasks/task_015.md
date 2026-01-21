# Task ID: 15

**Title:** Create Main Application Entry Point

**Status:** done

**Dependencies:** 8 ✓, 9 ✓, 10 ✓, 11 ✓, 12 ✓, 13 ✓, 14 ✓

**Priority:** high

**Description:** Implement the main index.ts file that initializes and starts the MCP server

**Details:**

Create index.ts in src/ root that imports configuration, initializes logging, creates AutotaskService and MappingService instances, sets up MCP server with all handlers and tools, and starts the server. Include graceful shutdown handling and error recovery. Export main function for CLI usage.

**Test Strategy:**

Test server startup/shutdown, configuration loading, service initialization, error handling during startup
