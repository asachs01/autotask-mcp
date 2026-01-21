# Task ID: 12

**Title:** Implement Ticket Management Tools

**Status:** done

**Dependencies:** 8 ✓, 5 ✓, 6 ✓

**Priority:** medium

**Description:** Create MCP tools for ticket search and creation operations

**Details:**

Create ticket-tools.ts in handlers/ with search_tickets and create_ticket tools. search_tickets supports filtering by status, priority, assignee, company with pagination. create_ticket accepts companyID, title, description, priority, status parameters. Include automatic resolution of companyID and assignedResourceID to names in responses.

**Test Strategy:**

Test ticket search with complex filters, ticket creation with required fields, enhanced responses with resolved names
