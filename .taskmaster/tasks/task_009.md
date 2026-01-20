# Task ID: 9

**Title:** Create MCP Resource Handlers

**Status:** pending

**Dependencies:** 8, 5

**Priority:** medium

**Description:** Implement MCP resource handlers for read-only access to Autotask data

**Details:**

Create resource-handlers.ts in handlers/ directory. Implement handlers for autotask://companies, autotask://companies/{id}, autotask://contacts, autotask://contacts/{id}, autotask://tickets, autotask://tickets/{id}, autotask://time-entries resources. Each handler should return properly formatted MCP resource responses with content and metadata.

**Test Strategy:**

Test resource URI parsing, data retrieval and formatting, error handling for invalid IDs
