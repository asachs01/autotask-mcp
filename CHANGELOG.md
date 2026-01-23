## [2.0.3](https://github.com/asachs01/autotask-mcp/compare/v2.0.2...v2.0.3) (2026-01-23)


### Bug Fixes

* add CLI bin entry and enforce test failures in CI ([10ce1c7](https://github.com/asachs01/autotask-mcp/commit/10ce1c71324f5b301a6b41e151f187f377cd6793)), closes [#4](https://github.com/asachs01/autotask-mcp/issues/4) [#4](https://github.com/asachs01/autotask-mcp/issues/4)

## [2.0.2](https://github.com/asachs01/autotask-mcp/compare/v2.0.1...v2.0.2) (2026-01-23)


### Bug Fixes

* **tests:** Resolve ESM compatibility and rewrite mapping tests ([a294a7c](https://github.com/asachs01/autotask-mcp/commit/a294a7c390a5ae56b70c269f5f6aaf0c3ff224e5))

## [2.0.1](https://github.com/asachs01/autotask-mcp/compare/v2.0.0...v2.0.1) (2026-01-21)


### Bug Fixes

* **ci:** Add proper permissions for release and security scan jobs ([d60e138](https://github.com/asachs01/autotask-mcp/commit/d60e138684c214dcab6196cffe977fb581bc20eb))
* **ci:** Disable npm publishing in semantic-release ([ae11880](https://github.com/asachs01/autotask-mcp/commit/ae118800add292aaf5aa626aef29cc61e9d8cff9))
* **ci:** Replace local file dependency with git dependency for autotask-node ([828bf1a](https://github.com/asachs01/autotask-mcp/commit/828bf1abb4872ecc40c0b64ea080c6126ecee2ed)), closes [asachs01/autotask-node#v2](https://github.com/asachs01/autotask-node/issues/v2)

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.0] - 2026-01-21

### Breaking Changes
- **Tool Namespacing**: All 35 MCP tools now use `autotask_` prefix to prevent naming collisions when multiple MCP servers are connected
  - `search_companies` → `autotask_search_companies`
  - `create_ticket` → `autotask_create_ticket`
  - `test_connection` → `autotask_test_connection`
  - All other tools follow the same pattern: `autotask_<original_name>`
- **Migration Required**: Update all tool calls in your MCP client configuration to use the new namespaced names

### Changed
- All tool definitions in `tool.handler.ts` updated with `autotask_` prefix
- Documentation updated to reflect new tool names

## [1.0.2] - 2026-01-21

### Fixed
- **Issue #9: Inaccurate Endpoints, Excessive Calls**: Upgraded to `autotask-node` v2.0.2 which fixes the critical `maxRecords` casing bug. The Autotask REST API is case-sensitive and was silently ignoring `MaxRecords` (uppercase M), causing all records to be returned instead of paginated results.
- **Issue #8: Claude Desktop and Docker unable to return results**: Added `searchTerm` → filter transformation for Companies, Contacts, and Resources
  - Company searches now filter on `companyName` field instead of fetching all companies
  - Contact searches now filter across `firstName`, `lastName`, and `emailAddress` fields
  - Resource searches now filter across `email`, `firstName`, and `lastName` fields
  - When searching with `searchTerm`, limits pagination to 100 results for efficiency
- **Issue #3: Autotask MCP out of sync with REST schema**: Fixed by upgrading to `autotask-node` v2.0.2 which corrects:
  - `MaxRecords` → `maxRecords` (lowercase m) across all 214 entity files
  - Proper POST `/query` endpoint usage for all list operations

### Changed
- **Dependency Upgrade**: Updated `autotask-node` to v2.0.2 with critical pagination fix
- **Search Efficiency**: When `searchTerm` is provided, searches return filtered results directly from API instead of paginating through all records

### Fixed (Previous)
- **🚨 CRITICAL DATA ACCURACY FIX**: Implemented pagination-by-default to eliminate massive ticket undercounts
  - **Root Cause**: Default page size was limited to 25-50 tickets, causing severe data accuracy issues
  - **Solution**: All search tools now paginate through ALL results by default for complete datasets
  - **Impact**: Fixes undercounting from 26 tickets to actual counts (e.g., 97+ tickets)
  - **User Control**: Only specify `pageSize` parameter when you actually want to limit results
- **CRITICAL: Massive Ticket Undercount**: Fixed automatic company filter that was severely limiting ticket search results (was showing only ~10 tickets instead of 97+)
- **Critical Unassigned Ticket Search Issue**: Fixed inability to search for unassigned tickets that was causing discrepancies between UI and API results
- **Parameter Mapping Issue**: Fixed `companyID` to `companyId` parameter mapping in `search_tickets` tool handler
- Enhanced ticket filtering logic to properly handle all filter parameters including assignment status

### Changed
- **Default Behavior**: `search_tickets` and all search tools now return complete datasets via automatic pagination
- **Performance**: Increased page size to 500 tickets per API request for efficiency while paginating
- **Safety**: Added pagination safety limit of 100 pages (50,000 tickets) to prevent infinite loops
- **Tool Descriptions**: Updated all search tool descriptions to clarify pagination-by-default behavior
- **Status Filtering**: Improved open ticket definition (status < 5) for accurate filtering

### Added
- **Data Accuracy Guarantee**: All search operations now provide complete, paginated results by default
- **Enhanced ID-to-Name Mapping**: Comprehensive mapping service with intelligent caching
  - New tools: `get_company_name`, `get_resource_name`, `get_mapping_cache_stats`, `clear_mapping_cache`, `preload_mapping_cache`
  - Automatic enhancement of search results with `_enhanced` field containing resolved names
  - 30-minute cache expiry with graceful fallback for missing data
- **Pagination Testing**: Added test scripts to verify complete data retrieval (`npm run test:pagination`)
- **Unassigned Ticket Support**: Added `unassigned` boolean parameter to `search_tickets` tool to search for tickets without assigned resources
- **Enhanced Tool Handler**: `EnhancedAutotaskToolHandler` with automatic ID-to-name resolution

### Fixed (Additional)
- **CRITICAL: Incomplete Company/Resource Mapping**: Fixed mapping cache that was limited to 500 records, causing "Customer 624" style names instead of proper company names
- **All Search Methods Now Complete**: Applied pagination-by-default to `searchCompanies`, `searchContacts`, and `searchResources` to ensure mapping cache includes ALL entities
- **Graceful Mapping Fallback**: Enhanced mapping service to not throw errors on cache failures, allowing direct API lookups as fallback

## [1.1.1] - 2025-06-10

### Fixed
- **Critical**: Resolved "result exceeds maximum length" errors in ticket searches by implementing aggressive data optimization
- Limited ticket search results to maximum 3 tickets per query to stay under 1MB MCP response limit
- Reduced ticket data from 76 fields (~2KB per ticket) to 18 essential fields (~685 characters per ticket)
- Added service-level result limiting as safety measure since Autotask API may ignore pageSize parameter
- Improved null handling in ticket data optimization to prevent runtime errors

### Changed
- Updated `search_tickets` tool description to clarify field limitations and recommend `get_ticket_details` for full data
- Reduced maximum pageSize for ticket searches from 100 to 3 due to API response size constraints
- Enhanced ticket data truncation with clear indicators to use `get_ticket_details` for full content

### Added
- N/A

### Fixed
- N/A

## [1.1.0] - 2024-12-10

### Added
**Phase 1: High-Priority Entity Support**
- **Notes Management**: Support for ticket, project, and company notes
  - New tools: `get_ticket_note`, `search_ticket_notes`, `create_ticket_note`
  - New tools: `get_project_note`, `search_project_notes`, `create_project_note`
  - New tools: `get_company_note`, `search_company_notes`, `create_company_note`
- **Attachments Management**: Support for ticket attachments
  - New tools: `get_ticket_attachment`, `search_ticket_attachments`
- **Expense Management**: Support for expense reports
  - New tools: `get_expense_report`, `search_expense_reports`, `create_expense_report`
- **Quotes Management**: Support for sales quotes
  - New tools: `get_quote`, `search_quotes`, `create_quote`
- **Extended Type Definitions**: New interfaces for all supported entities
  - `AutotaskNote`, `AutotaskTicketNote`, `AutotaskProjectNote`, `AutotaskCompanyNote`
  - `AutotaskAttachment`, `AutotaskTicketAttachment`
  - `AutotaskExpenseReport`, `AutotaskExpenseItem`
  - `AutotaskQuote`, `AutotaskBillingCode`, `AutotaskDepartment`
  - Extended query options with `AutotaskQueryOptionsExtended`
- **Comprehensive Testing**: Full test coverage for all new entity methods

### Enhanced
- **Tool Count**: Expanded from 18 to 27 total MCP tools
- **Entity Support**: Now supports 10+ Autotask entities with comprehensive CRUD operations
- **Error Handling**: Improved error messages for unsupported operations
- **API Coverage**: Enhanced coverage of autotask-node library capabilities

### Notes
- Expense items, billing codes, and departments marked as not directly supported in current autotask-node version
- All new tools follow existing pagination and optimization patterns
- Backward compatibility maintained with all existing functionality

## [1.0.4] - 2025-01-09

### Added
- **Data Optimization for Large Responses**: Implemented comprehensive data optimization to prevent "result exceeds maximum length" errors
  - Added field filtering for ticket searches to return only essential fields
  - Implemented automatic text truncation for large description fields (tickets: 500 chars, tasks: 400 chars)
  - Added pagination limits with sensible defaults (tickets/projects/tasks: 25 default, 100 max; companies/contacts: 50 default, 200 max)
  - Created `get_ticket_details` tool for retrieving full ticket data when needed
  - Added data optimization for projects and tasks with similar field filtering

### Changed
- **Ticket Search Optimization**: `search_tickets` now returns optimized data by default
  - Essential fields only: id, ticketNumber, title, description (truncated), status, priority, etc.
  - Removed large arrays like userDefinedFields
  - Truncated resolution and description fields to prevent oversized responses
- **Project and Task Search Optimization**: Applied similar optimization strategies
  - Field filtering for essential data only
  - Description truncation with "... [truncated]" indicators
  - Reduced pagination limits for better performance
- **Tool Descriptions**: Updated tool descriptions to clarify optimization behavior
- **Pagination Limits**: Reduced maximum page sizes across all entity searches for better performance

### Fixed
- **TypeScript Compilation**: Fixed type compatibility issues with optimization functions
- **Response Size Management**: Eliminated "result exceeds maximum length" errors for ticket searches

### Technical Details
- Added `optimizeTicketData()`, `optimizeProjectData()`, and `optimizeTaskData()` methods
- Implemented field filtering using `includeFields` parameter where supported
- Enhanced error handling and logging for optimization processes

## [1.0.3] - 2025-06-09

### Added
- **Major Entity Expansion**: Added support for 8 additional Autotask entities:
  - **Projects**: Search, create, and update project records
  - **Resources**: Search for users/employees in Autotask
  - **Configuration Items**: Search for managed assets and devices
  - **Contracts**: Search for service contracts (read-only)
  - **Invoices**: Search for billing invoices (read-only)
  - **Tasks**: Search, create, and update project tasks
- **Enhanced Tool Coverage**: Expanded from 9 to 17 available MCP tools
- **Comprehensive Type Definitions**: Added TypeScript interfaces for all new entities
- **Status Enums**: Added helpful enums for project, task, opportunity, and contract statuses

### Improved
- **Better Error Handling**: Enhanced type casting for compatibility with autotask-node library
- **Code Organization**: Structured service methods by entity type for better maintainability

## [1.0.2] - 2025-06-09

### Fixed
- **Critical MCP Protocol Fix**: Enhanced stdout wrapper to completely filter all non-JSON-RPC output, eliminating "invalid union" errors in Claude Desktop
- **Critical Authentication Fix**: Removed extra quotes from AUTOTASK_SECRET in .env file that were causing 401 Unauthorized errors
- **Environment Variable Loading**: Updated docker-compose.yml to explicitly use `env_file` directive for proper environment variable handling
- **Lazy Initialization**: Implemented lazy initialization of Autotask client to prevent MCP timeout issues during server startup
- **Container Restart Issues**: Fixed Docker container to start quickly without blocking on Autotask API connection
- **Winston Logger Output**: Fixed Winston logs leaking to stdout by implementing comprehensive stdout interception

### Improved
- **MCP Compliance**: Now fully compliant with JSON-RPC protocol - only valid MCP messages on stdout
- **Error Diagnostics**: Enhanced credential validation and error reporting
- **Development Experience**: Faster development iteration with immediate container startup

## [1.0.1] - 2024-12-09

### Fixed
- **Stdout Interference**: Added TypeScript wrapper script to redirect all non-MCP stdout output to stderr
- **Logger Output**: Fixed logging to use stderr instead of stdout for Claude Desktop compatibility  
- **Third-party Library Output**: Prevented autotask-node library output from interfering with MCP JSON-RPC protocol
- **Build Process**: Fixed wrapper compilation by converting to TypeScript (.ts) for proper build inclusion
- **Docker Image Tag**: Updated documentation to use correct Docker image tag
- **MCP Protocol**: Resolved JSON-RPC parsing errors when connecting to Claude Desktop

### Documentation
- Enhanced Quick Start guide with system-specific configuration examples
- Added troubleshooting section for common Claude Desktop connection issues

## [1.0.0] - 2024-12-09

### Added
- Initial project setup and architecture
- MCP server implementation with full protocol compliance
- Autotask service layer with comprehensive API coverage
- Docker and docker-compose configuration for easy deployment
- Comprehensive test suite with 80%+ coverage requirement
- Structured logging with configurable levels and formats
- TypeScript types for all Autotask entities and MCP protocol
- Complete CI/CD ready setup

### Changed
- N/A (initial release)

### Deprecated
- N/A (initial release)

### Removed
- N/A (initial release)

### Fixed
- N/A (initial release)

### Security
- Implemented secure credential handling through environment variables
- Added non-root user in Docker container for security
- Configured proper resource limits for container deployment

## [1.0.0] - 2024-12-09

### Added
- **🔌 MCP Protocol Compliance**: Full Model Context Protocol implementation
- **🛠️ Autotask Integration**: Complete integration with Kaseya Autotask PSA via autotask-node
- **📚 Resource Access**: Read-only access to companies, contacts, tickets, and time entries
- **🔧 Tool Operations**: CRUD operations for core Autotask entities
- **🔍 Advanced Search**: Powerful search capabilities with filters
- **🐳 Container Support**: Docker and docker-compose configuration
- **📊 Logging System**: Winston-based structured logging
- **🧪 Test Framework**: Jest-based testing with coverage requirements
- **📝 Documentation**: Comprehensive README and API documentation
- **⚙️ Configuration**: Environment-based configuration management

### Core Features
- **Autotask Entities**: Companies, Contacts, Tickets, Time Entries
- **MCP Resources**: Structured read access to Autotask data
- **MCP Tools**: Interactive operations for data manipulation
- **Authentication**: Secure API credential management
- **Error Handling**: Comprehensive error handling with proper MCP error codes
- **Type Safety**: Full TypeScript implementation

### Development Features
- **Hot Reload**: Development server with hot reload capability
- **Testing**: Unit, integration, and API tests
- **Linting**: ESLint configuration with TypeScript support
- **Building**: TypeScript compilation pipeline
- **Docker**: Multi-stage Dockerfile for optimized containers

### Security
- Non-root container execution
- Environment variable credential management
- Input validation and sanitization
- Resource limits and health checks

---

## Release Process

### Version Numbering
This project follows [Semantic Versioning](https://semver.org/):
- **MAJOR**: Incompatible API changes
- **MINOR**: New functionality in a backwards compatible manner
- **PATCH**: Backwards compatible bug fixes

### Release Notes Format
Each release includes:
- **NEW FEATURES**: Major new functionality
- **IMPROVEMENTS**: Enhancements to existing features
- **FIXES**: Bug fixes and stability improvements
- **BREAKING CHANGES**: Any breaking changes and migration guides

### Upcoming Features (Roadmap)
- HTTP transport option for MCP
- Additional Autotask entities (Projects, Assets, etc.)
- Webhook support for real-time updates
- Advanced filtering and sorting options
- Bulk operations for data manipulation
- Performance optimizations and caching
- GraphQL interface for advanced queries
