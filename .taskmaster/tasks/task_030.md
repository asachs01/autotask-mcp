# Task ID: 30

**Title:** Add MCP Elicitation Support for Interactive Workflows

**Status:** pending

**Dependencies:** 29

**Priority:** low

**Description:** Implement MCP elicitation protocol to enable interactive parameter collection when required tool parameters are missing.

**Details:**

MCP elicitation allows servers to request additional information from users during tool execution. This is essential for:

1. **Missing Required Parameters**: When a tool is called without required params (e.g., create_ticket without companyId)
2. **Disambiguation**: When search results return multiple matches
3. **Confirmation**: For destructive operations (delete, update)
4. **Multi-Step Workflows**: Collecting parameters across multiple steps

**Implementation:**
1. Add elicitation support to tool handler
2. Define elicitation schemas for each tool's required parameters
3. Implement confirmation prompts for create/update/delete operations
4. Add disambiguation UI for multiple search results
5. Support conversation context for multi-turn interactions

**Example Elicitation Flow:**
```
User: 'Create a ticket'
Server: [elicit] 'Which company is this ticket for?'
User: 'Acme Corp'
Server: [elicit] 'Found 2 companies: Acme Corp Inc, Acme Corporation. Which one?'
User: 'Acme Corp Inc'
Server: [elicit] 'What is the ticket title?'
User: 'Network issue'
Server: [execute] create_ticket(companyId=123, title='Network issue')
```

**Test Strategy:**

1. Test elicitation triggers for missing required params. 2. Test disambiguation with multiple search results. 3. Test confirmation prompts for destructive operations. 4. Test multi-turn conversation context preservation. 5. Test graceful fallback when elicitation unsupported by client.
