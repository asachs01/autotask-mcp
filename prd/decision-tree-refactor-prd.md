# PRD: Autotask MCP Decision-Tree Architecture Refactor

## Summary

Refactor the autotask-mcp server from a flat dispatch architecture (40+ tools registered simultaneously) to a decision-tree navigation pattern with lazy-loaded domain handlers. This reduces cognitive overhead for LLM consumers, lowers token usage, and improves tool selection accuracy by presenting only contextually relevant tools at each step.

## Problem

The current autotask-mcp server registers all 40+ tools in a flat list when the MCP connection is established. This creates several issues for LLM-based consumers:

1. **Token overhead**: Every tool call includes the full tool schema in context, consuming ~4,000+ tokens just for tool definitions
2. **Selection accuracy**: LLMs must choose from 40+ tools simultaneously, leading to occasional misselection (e.g., choosing `autotask_search_tickets` when `autotask_search_tasks` was intended)
3. **Cognitive overload**: New users see an overwhelming list of tools without clear guidance on which to use for their workflow
4. **Scaling ceiling**: Adding new entity tools (products, services, price lists) makes the flat list even longer, compounding all above issues
5. **No progressive disclosure**: All tools are equally visible regardless of the user's current workflow context

The ninjaone-mcp server has already solved this problem with a decision-tree architecture that reduced effective tool exposure from 30+ to 3-5 tools at any given time.

## User Stories

- As an LLM consumer of autotask-mcp, I want to see only the tools relevant to my current domain (e.g., tickets) so that I can make faster, more accurate tool selections
- As an MSP technician using Claude with Autotask, I want a guided navigation experience so that I can discover available operations without memorizing tool names
- As a developer extending autotask-mcp, I want to add new entity handlers without modifying a monolithic dispatch table so that new features are isolated and testable
- As an MSP manager reviewing token usage, I want lower per-request token costs so that the MCP integration is more cost-effective at scale

## Scope

### In Scope

- Refactor flat tool dispatch into domain-based navigation tree
- Implement domain handlers for: tickets, companies, projects, contracts, billing, configuration, picklists, products
- Maintain all existing tool functionality (no features removed)
- Preserve existing tool names for backward compatibility during transition
- Lazy-load domain handlers on first access
- Navigation tool (`autotask_navigate`) for domain selection
- Context-aware tool filtering based on current domain
- Migration documentation

### Out of Scope

- New entity support (handled separately)
- Breaking changes to existing tool schemas
- UI/client-side changes
- Authentication or credential changes
- Rate limiting changes
- Performance benchmarking infrastructure

## Technical Approach

### Architecture Overview

Replace the single `getDispatchTable()` method with a domain-based handler system:

```
User request
  → autotask_navigate (select domain: "tickets")
  → Domain handler loaded (TicketsDomainHandler)
  → Only ticket-related tools exposed:
    - autotask_search_tickets
    - autotask_get_ticket_details
    - autotask_create_ticket
    - autotask_search_ticket_notes
    - autotask_create_ticket_note
    - autotask_search_ticket_attachments
  → User works within domain
  → autotask_navigate (switch to "companies" or back to root)
```

### Key Interfaces

```typescript
type DomainName =
  | 'tickets'
  | 'companies'
  | 'projects'
  | 'contracts'
  | 'billing'
  | 'configuration'
  | 'picklists'
  | 'products'
  | 'time_entries'
  | 'resources';

interface DomainHandler {
  name: DomainName;
  description: string;
  getTools(): McpTool[];
  handleToolCall(name: string, args: Record<string, any>): Promise<McpToolResult>;
}

interface NavigationState {
  currentDomain: DomainName | null;
  availableDomains: DomainName[];
  history: DomainName[];
}
```

### Domain Mapping

| Domain | Current Tools | Handler |
|--------|-------------|---------|
| tickets | search_tickets, get_ticket_details, create_ticket, *_ticket_notes, *_ticket_attachments | TicketsDomainHandler |
| companies | search_companies, create_company, update_company, search_contacts, create_contact, *_company_notes | CompaniesDomainHandler |
| projects | search_projects, create_project, *_project_notes, search_tasks, create_task | ProjectsDomainHandler |
| contracts | search_contracts | ContractsDomainHandler |
| billing | search_invoices, search_billing_items, get_billing_item, *_billing_item_approval_levels | BillingDomainHandler |
| configuration | search_configuration_items | ConfigurationDomainHandler |
| picklists | list_queues, list_ticket_statuses, list_ticket_priorities, get_field_info | PicklistsDomainHandler |
| products | search_products, get_product, search_services, search_inventory_items, search_price_list_* | ProductsDomainHandler |
| time_entries | create_time_entry, search_time_entries | TimeEntriesDomainHandler |
| resources | search_resources | ResourcesDomainHandler |

### Migration Path

1. **Phase 1**: Create DomainHandler interface and NavigationState
2. **Phase 2**: Extract existing tool handlers into domain-specific files
3. **Phase 3**: Add `autotask_navigate` tool and navigation logic
4. **Phase 4**: Implement lazy loading of domain handlers
5. **Phase 5**: Update tool listing to respect current navigation state
6. **Phase 6**: Add backward-compat mode (env flag to use flat dispatch)

### Reference Implementation

The `wyre-technology/ninjaone-mcp` server implements this pattern successfully. Key files to reference:
- Domain handler structure and interface
- Navigation state management
- Lazy loading pattern
- Tool exposure filtering

### File Structure (Target)

```
src/
├── handlers/
│   ├── tool.handler.ts          (refactored: uses domain routing)
│   ├── tool.definitions.ts      (kept for backward compat mode)
│   ├── navigation.handler.ts    (new: navigation state machine)
│   └── domains/
│       ├── index.ts
│       ├── base.domain.ts       (abstract DomainHandler)
│       ├── tickets.domain.ts
│       ├── companies.domain.ts
│       ├── projects.domain.ts
│       ├── contracts.domain.ts
│       ├── billing.domain.ts
│       ├── configuration.domain.ts
│       ├── picklists.domain.ts
│       ├── products.domain.ts
│       ├── time-entries.domain.ts
│       └── resources.domain.ts
├── services/
│   └── autotask.service.ts      (unchanged)
└── types/
    ├── autotask.ts              (unchanged)
    └── navigation.ts            (new: navigation types)
```

## Success Criteria

- [ ] All existing tools continue to work with identical inputs/outputs
- [ ] Navigation tool allows domain selection and returns only relevant tools
- [ ] Domain handlers lazy-load on first access (not at startup)
- [ ] Flat dispatch mode available via environment variable for backward compatibility
- [ ] Token usage for tool definitions reduced by 60%+ in navigated mode
- [ ] All existing tests continue to pass
- [ ] Each domain handler is independently testable
- [ ] Migration documentation covers upgrade path for existing users

## Open Questions

- Should navigation state persist across MCP sessions or reset on reconnect?
- Should cross-domain tools (e.g., test_connection) be always available or in a "system" domain?
- What is the optimal number of domains? (Currently 10 — could consolidate contracts+billing, or split tickets into tickets+notes)
- Should the backward-compat flat mode be the default initially, with decision-tree as opt-in?
