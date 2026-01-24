---
title: Resources Reference
description: MCP resources available for direct data access.
---

The Autotask MCP Server provides MCP resources for direct access to entity data. Resources use URI-based addressing and return structured content.

## Available Resources

### Companies

| URI | Description |
|-----|-------------|
| `autotask://companies` | List all companies |
| `autotask://companies/{id}` | Get a specific company by ID |

### Contacts

| URI | Description |
|-----|-------------|
| `autotask://contacts` | List all contacts |
| `autotask://contacts/{id}` | Get a specific contact by ID |

### Tickets

| URI | Description |
|-----|-------------|
| `autotask://tickets` | List all tickets |
| `autotask://tickets/{id}` | Get a specific ticket by ID |

## Usage

Resources are typically used by MCP clients for:

- **Context loading** — Pre-loading entity data before a conversation
- **Direct access** — Getting a specific record by its known ID
- **Browsing** — Exploring available data without search criteria

## Resources vs Tools

| Aspect | Resources | Tools |
|--------|-----------|-------|
| Access pattern | URI-based (read-only) | Function call (read/write) |
| Filtering | None (returns all or by ID) | Search terms, field filters, pagination |
| Use case | Browsing, context loading | Specific queries, mutations |
| Response | Raw entity data | Formatted with enhancements |

For most interactive use cases, the search tools provide a better experience with filtering, pagination, and ID-to-name resolution.
