# Task ID: 29

**Title:** Implement Decision Tree Based Tool Routing

**Status:** pending

**Dependencies:** 28

**Priority:** medium

**Description:** Add intelligent tool routing using decision trees to automatically select appropriate tools based on user intent, reducing cognitive load and improving accuracy.

**Details:**

Create a decision tree system that routes user requests to appropriate tools based on intent classification:

**Decision Tree Structure:**
```
User Intent
├── Customer Lookup
│   ├── By Name → search_companies / search_contacts
│   ├── By ID → get_company / get_contact
│   └── Create New → create_company / create_contact
├── Ticket Management
│   ├── Find Tickets → search_tickets
│   ├── Create Ticket → create_ticket (requires: companyId, title)
│   └── Update Ticket → update_ticket
├── Time Tracking
│   ├── Log Time → create_time_entry (requires: ticketId, hours)
│   └── View Time → get_time_entries
└── Resource Management
    ├── Find Resource → search_resources
    └── Resource Details → get_resource
```

**Implementation:**
1. Create `autotask_router` meta-tool that accepts natural language intent
2. Implement intent classifier (can use simple keyword matching or embeddings)
3. Build decision tree with required/optional parameter mapping
4. Add MCP elicitation support for missing required parameters
5. Return suggested tool + pre-filled parameters
6. Support multi-step workflows (e.g., 'create ticket for Acme Corp' → search_companies → create_ticket)

**Example Flow:**
User: 'Log 2 hours on ticket 12345'
→ Router identifies: Time Tracking → Log Time
→ Extracts: ticketId=12345, hours=2
→ Returns: {tool: 'create_time_entry', params: {ticketId: 12345, hours: 2}}

**Test Strategy:**

1. Test intent classification accuracy with sample queries. 2. Verify decision tree correctly routes to expected tools. 3. Test parameter extraction from natural language. 4. Test MCP elicitation for missing parameters. 5. Test multi-step workflow execution. 6. Benchmark routing latency vs direct tool call.
