# Autotask MCP Server

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server that provides AI assistants with structured access to Kaseya Autotask PSA data and operations.

## Quick Start

The fastest way to get started is with the pre-built MCPB bundle — a single-file package with all dependencies included. No npm install needed, just Node.js 18+.

**1. Download the bundle** from the [latest release](https://github.com/asachs01/autotask-mcp/releases/latest):

```bash
# Download and extract to ~/.mcp/autotask-mcp/
mkdir -p ~/.mcp/autotask-mcp
curl -L https://github.com/asachs01/autotask-mcp/releases/latest/download/autotask-mcp.mcpb -o /tmp/autotask-mcp.mcpb
unzip -o /tmp/autotask-mcp.mcpb -d ~/.mcp/autotask-mcp
```

**2. Add to your MCP client config** (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "autotask": {
      "command": "node",
      "args": ["~/.mcp/autotask-mcp/dist/entry.js"],
      "env": {
        "AUTOTASK_USERNAME": "your-user@company.com",
        "AUTOTASK_SECRET": "your-secret",
        "AUTOTASK_INTEGRATION_CODE": "your-code"
      }
    }
  }
}
```

**For Claude Code (CLI):**

```bash
claude mcp add autotask-mcp \
  -e AUTOTASK_USERNAME=your-user@company.com \
  -e AUTOTASK_SECRET=your-secret \
  -e AUTOTASK_INTEGRATION_CODE=your-code \
  -- node ~/.mcp/autotask-mcp/dist/entry.js
```

See [Installation](#installation) for npx, Docker, and other methods.

## Features

- **🔌 MCP Protocol Compliance**: Full support for MCP resources and tools
- **🛠️ Comprehensive API Coverage**: 35 tools spanning companies, contacts, tickets, projects, notes, attachments, and more
- **🔍 Advanced Search**: Powerful search capabilities with filters across all entities
- **📝 CRUD Operations**: Create, read, update operations for core Autotask entities
- **🔄 ID-to-Name Mapping**: Automatic resolution of company and resource IDs to human-readable names
- **⚡ Intelligent Caching**: Smart caching system for improved performance and reduced API calls
- **🔒 Secure Authentication**: Enterprise-grade API security with Autotask credentials
- **🌐 Dual Transport**: Supports both stdio (local) and HTTP Streamable (remote/Docker) transports
- **📦 MCPB Packaging**: One-click installation via MCP Bundle for desktop clients
- **🐳 Docker Ready**: Containerized deployment with HTTP transport and health checks
- **📊 Structured Logging**: Comprehensive logging with configurable levels and formats
- **🧪 Test Coverage**: Comprehensive test suite with 80%+ coverage

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Reference](#api-reference)
- [ID-to-Name Mapping](#id-to-name-mapping)
- [HTTP Transport](#http-transport)
- [Docker Deployment](#docker-deployment)
- [Claude Desktop Integration](#claude-desktop-integration)
- [Development](#development)
- [Testing](#testing)
- [Contributing](#contributing)
- [Contributors](#contributors)
- [License](#license)

## Installation

### Option 1: MCPB Bundle (Recommended)

Download the pre-built bundle from the [latest release](https://github.com/asachs01/autotask-mcp/releases/latest). This includes all dependencies — no npm install or network fetch needed at runtime.

```bash
mkdir -p ~/.mcp/autotask-mcp
curl -L https://github.com/asachs01/autotask-mcp/releases/latest/download/autotask-mcp.mcpb -o /tmp/autotask-mcp.mcpb
unzip -o /tmp/autotask-mcp.mcpb -d ~/.mcp/autotask-mcp
```

Then configure your MCP client:

```json
{
  "mcpServers": {
    "autotask": {
      "command": "node",
      "args": ["~/.mcp/autotask-mcp/dist/entry.js"],
      "env": {
        "AUTOTASK_USERNAME": "your-user@company.com",
        "AUTOTASK_SECRET": "your-secret",
        "AUTOTASK_INTEGRATION_CODE": "your-code"
      }
    }
  }
}
```

### Option 2: npx from GitHub

No local download needed — `npx` installs directly from the GitHub repo on each run:

```json
{
  "mcpServers": {
    "autotask": {
      "command": "npx",
      "args": ["-y", "github:asachs01/autotask-mcp"],
      "env": {
        "AUTOTASK_USERNAME": "your-user@company.com",
        "AUTOTASK_SECRET": "your-secret",
        "AUTOTASK_INTEGRATION_CODE": "your-code"
      }
    }
  }
}
```

### Option 3: Docker (GitHub Container Registry)

```bash
docker pull ghcr.io/asachs01/autotask-mcp:latest
```

For Claude Desktop (stdio via Docker):

```json
{
  "mcpServers": {
    "autotask": {
      "command": "docker",
      "args": [
        "run", "--rm", "-i",
        "-e", "MCP_TRANSPORT=stdio",
        "-e", "AUTOTASK_USERNAME=your-user@company.com",
        "-e", "AUTOTASK_SECRET=your-secret",
        "-e", "AUTOTASK_INTEGRATION_CODE=your-code",
        "--entrypoint", "node",
        "ghcr.io/asachs01/autotask-mcp:latest",
        "dist/entry.js"
      ]
    }
  }
}
```

For HTTP transport (remote/server deployment), see [Docker Deployment](#docker-deployment).

### Option 4: From Source

```bash
git clone https://github.com/asachs01/autotask-mcp.git
cd autotask-mcp
npm ci
npm run build
```

Then configure Claude Desktop:

```json
{
  "mcpServers": {
    "autotask": {
      "command": "node",
      "args": ["/path/to/autotask-mcp/dist/entry.js"],
      "env": {
        "AUTOTASK_USERNAME": "your-user@company.com",
        "AUTOTASK_SECRET": "your-secret",
        "AUTOTASK_INTEGRATION_CODE": "your-code"
      }
    }
  }
}
```

### Prerequisites

- Node.js 18+ (LTS recommended)
- Valid Autotask API credentials
- MCP-compatible client (Claude Desktop, Continue, etc.)

## Configuration

### Environment Variables

Create a `.env` file with your configuration:

```bash
# Required Autotask API credentials
AUTOTASK_USERNAME=your-api-user@example.com
AUTOTASK_SECRET=your-secret-key
AUTOTASK_INTEGRATION_CODE=your-integration-code

# Optional configuration
AUTOTASK_API_URL=https://webservices.autotask.net/atservices/1.6/atws.asmx
MCP_SERVER_NAME=autotask-mcp

# Transport (stdio for local/desktop, http for remote/Docker)
MCP_TRANSPORT=stdio          # stdio, http
MCP_HTTP_PORT=8080           # HTTP transport port (only used when MCP_TRANSPORT=http)
MCP_HTTP_HOST=0.0.0.0        # HTTP transport bind address

# Logging
LOG_LEVEL=info          # error, warn, info, debug
LOG_FORMAT=simple       # simple, json

# Environment
NODE_ENV=production
```

💡 **Pro Tip**: Copy the above content to a `.env` file in your project root.

### Autotask API Setup

1. **Create API User**: In Autotask, create a dedicated API user with appropriate permissions
2. **Generate Secret**: Generate an API secret for the user
3. **Integration Code**: Obtain your integration code from Autotask
4. **Permissions**: Ensure the API user has read/write access to required entities

For detailed setup instructions, see the [Autotask API documentation](https://ww3.autotask.net/help/DeveloperHelp/Content/AdminSetup/2ExtensionsIntegrations/APIs/REST/REST_API_Home.htm).

## Usage

### Command Line

```bash
# Start the MCP server (stdio transport, for piping to an MCP client)
node dist/entry.js

# Start with HTTP transport
MCP_TRANSPORT=http node dist/index.js
```

### MCP Client Configuration

See [Claude Desktop Integration](#claude-desktop-integration) for full setup instructions, or use the Quick Start config above.

## API Reference

### Resources

Resources provide read-only access to Autotask data:

- `autotask://companies` - List all companies
- `autotask://companies/{id}` - Get specific company
- `autotask://contacts` - List all contacts  
- `autotask://contacts/{id}` - Get specific contact
- `autotask://tickets` - List all tickets
- `autotask://tickets/{id}` - Get specific ticket
- `autotask://time-entries` - List time entries

### Tools

The server provides 35 tools for interacting with Autotask:

#### Company Operations
- `autotask_search_companies` - Search companies with filters
- `autotask_create_company` - Create new company
- `autotask_update_company` - Update existing company

#### Contact Operations
- `autotask_search_contacts` - Search contacts with filters
- `autotask_create_contact` - Create new contact

#### Ticket Operations
- `autotask_search_tickets` - Search tickets with filters
- `autotask_get_ticket_details` - Get full ticket details by ID
- `autotask_create_ticket` - Create new ticket

#### Time Entry Operations
- `autotask_create_time_entry` - Log time entry

#### Project Operations
- `autotask_search_projects` - Search projects with filters
- `autotask_create_project` - Create new project

#### Resource Operations
- `autotask_search_resources` - Search resources (technicians/users)

#### Note Operations
- `autotask_get_ticket_note` / `autotask_search_ticket_notes` / `autotask_create_ticket_note`
- `autotask_get_project_note` / `autotask_search_project_notes` / `autotask_create_project_note`
- `autotask_get_company_note` / `autotask_search_company_notes` / `autotask_create_company_note`

#### Attachment Operations
- `autotask_get_ticket_attachment` - Get ticket attachment
- `autotask_search_ticket_attachments` - Search ticket attachments

#### Financial Operations
- `autotask_get_expense_report` / `autotask_search_expense_reports` / `autotask_create_expense_report`
- `autotask_get_quote` / `autotask_search_quotes` / `autotask_create_quote`
- `autotask_search_invoices` - Search invoices
- `autotask_search_contracts` - Search contracts

#### Configuration Items
- `autotask_search_configuration_items` - Search configuration items (assets)

#### Task Operations
- `autotask_search_tasks` - Search project tasks
- `autotask_create_task` - Create project task

#### Utility Operations
- `autotask_test_connection` - Test API connectivity

### Example Tool Usage

```javascript
// Search for companies
{
  "name": "autotask_search_companies",
  "arguments": {
    "searchTerm": "Acme Corp",
    "isActive": true,
    "pageSize": 10
  }
}

// Create a new ticket
{
  "name": "autotask_create_ticket",
  "arguments": {
    "companyID": 12345,
    "title": "Server maintenance request",
    "description": "Need to perform monthly server maintenance",
    "priority": 2,
    "status": 1
  }
}
```

## ID-to-Name Mapping

The Autotask MCP server includes intelligent ID-to-name mapping that automatically resolves company and resource IDs to human-readable names, making API responses much more useful for AI assistants and human users.

### Automatic Enhancement

All search and detail tools automatically include an `_enhanced` field with resolved names:

```json
{
  "id": 12345,
  "title": "Sample Ticket",
  "companyID": 678,
  "assignedResourceID": 90,
  "_enhanced": {
    "companyName": "Acme Corporation",
    "assignedResourceName": "John Smith"
  }
}
```

### How It Works

ID-to-name mapping is applied automatically to all search and detail tool results. No additional tools are needed — the `_enhanced` field is added transparently to every response that contains company or resource IDs.

### Performance Features

- **Smart Caching**: Names are cached for 30 minutes to reduce API calls
- **Bulk Operations**: Efficient batch lookups for multiple IDs
- **Graceful Fallback**: Returns "Unknown Company (123)" if lookup fails
- **Parallel Processing**: Multiple mappings resolved simultaneously

### Testing Mapping

Test the mapping functionality:

```bash
npm run test:mapping
```

For detailed mapping documentation, see [docs/mapping.md](docs/mapping.md).

## HTTP Transport

The server supports the MCP Streamable HTTP transport for remote deployments (e.g., Docker, cloud hosting). Set `MCP_TRANSPORT=http` to enable it.

```bash
# Start with HTTP transport
MCP_TRANSPORT=http MCP_HTTP_PORT=8080 node dist/index.js
```

The HTTP transport exposes:
- `POST /mcp` — MCP Streamable HTTP endpoint
- `GET /health` — Health check (returns `{"status":"ok"}`)

Clients must send requests to `/mcp` with `Accept: application/json, text/event-stream` headers per the MCP Streamable HTTP specification.

## Docker Deployment

The Docker image uses HTTP transport by default (port 8080) with a built-in health check.

### Using Pre-built Image from GitHub Container Registry

The Docker image defaults to **HTTP transport** on port 8080 — suitable for remote/server deployments where clients connect over the network.

```bash
# Pull the latest image
docker pull ghcr.io/asachs01/autotask-mcp:latest

# Run container with HTTP transport (default)
docker run -d \
  --name autotask-mcp \
  -p 8080:8080 \
  -e AUTOTASK_USERNAME="your-api-user@example.com" \
  -e AUTOTASK_SECRET="your-secret-key" \
  -e AUTOTASK_INTEGRATION_CODE="your-integration-code" \
  --restart unless-stopped \
  ghcr.io/asachs01/autotask-mcp:latest

# Verify it's running
curl http://localhost:8080/health
```

For **stdio** usage with Claude Desktop, see [Installation Option 2](#option-2-docker-github-container-registry).

### Quick Start (From Source)

```bash
# Clone repository
git clone https://github.com/asachs01/autotask-mcp.git
cd autotask-mcp

# Create environment file
cp .env.example .env
# Edit .env with your credentials

# Start with docker-compose
docker compose up -d
```

### Production Deployment

```bash
# Build production image locally
docker build -t autotask-mcp:latest .

# Run container
docker run -d \
  --name autotask-mcp \
  --env-file .env \
  --restart unless-stopped \
  autotask-mcp:latest
```

### Development Mode

```bash
# Start development environment with hot reload
docker compose --profile dev up autotask-mcp-dev
```

## Claude Desktop Integration

This section explains how to connect the Autotask MCP Server to Claude Desktop for seamless AI-powered Autotask interactions.

### Prerequisites

1. **Claude Desktop**: Download and install [Claude Desktop](https://claude.ai/desktop)
2. **MCP Server Running**: Have the Autotask MCP server running locally or in Docker
3. **Autotask Credentials**: Valid Autotask API credentials configured

### Configuration Steps

#### 1. Locate Claude Desktop Configuration

The Claude Desktop configuration file location varies by operating system:

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

#### 2. Configure MCP Server Connection

Add the Autotask MCP server to your Claude Desktop configuration:

**MCPB Bundle (recommended):**
```json
{
  "mcpServers": {
    "autotask": {
      "command": "node",
      "args": ["~/.mcp/autotask-mcp/dist/entry.js"],
      "env": {
        "AUTOTASK_USERNAME": "your-api-username@company.com",
        "AUTOTASK_SECRET": "your-api-secret",
        "AUTOTASK_INTEGRATION_CODE": "your-integration-code"
      }
    }
  }
}
```

**npx from GitHub (no local download):**
```json
{
  "mcpServers": {
    "autotask": {
      "command": "npx",
      "args": ["-y", "github:asachs01/autotask-mcp"],
      "env": {
        "AUTOTASK_USERNAME": "your-api-username@company.com",
        "AUTOTASK_SECRET": "your-api-secret",
        "AUTOTASK_INTEGRATION_CODE": "your-integration-code"
      }
    }
  }
}
```

**Local clone:**
```json
{
  "mcpServers": {
    "autotask": {
      "command": "node",
      "args": ["/path/to/autotask-mcp/dist/entry.js"],
      "env": {
        "AUTOTASK_USERNAME": "your-api-username@company.com",
        "AUTOTASK_SECRET": "your-api-secret",
        "AUTOTASK_INTEGRATION_CODE": "your-integration-code"
      }
    }
  }
}
```

**Claude Code (CLI):**
```bash
claude mcp add autotask-mcp \
  -e AUTOTASK_USERNAME=your-api-username@company.com \
  -e AUTOTASK_SECRET=your-api-secret \
  -e AUTOTASK_INTEGRATION_CODE=your-integration-code \
  -- node ~/.mcp/autotask-mcp/dist/entry.js
```

**Docker (stdio mode for Claude Desktop):**
```json
{
  "mcpServers": {
    "autotask": {
      "command": "docker",
      "args": [
        "run", "--rm", "-i",
        "-e", "MCP_TRANSPORT=stdio",
        "-e", "AUTOTASK_USERNAME=your-api-username@company.com",
        "-e", "AUTOTASK_SECRET=your-api-secret",
        "-e", "AUTOTASK_INTEGRATION_CODE=your-integration-code",
        "--entrypoint", "node",
        "ghcr.io/asachs01/autotask-mcp:latest",
        "dist/entry.js"
      ]
    }
  }
}
```

#### 3. Restart Claude Desktop

After updating the configuration:
1. Completely quit Claude Desktop
2. Restart the application
3. Verify the connection in the Claude interface

### Verification

#### Check MCP Server Status

Look for the MCP server indicator in Claude Desktop:
- **Connected**: Green indicator with "autotask" label
- **Disconnected**: Red indicator or missing server

#### Test Basic Functionality

Try these example prompts in Claude:

```
Show me all companies in Autotask
```

```
Create a new ticket for Company ID 123 with title "Server maintenance"
```

```
Search for contacts with email containing "@example.com"
```

### Available MCP Resources

Once connected, Claude can access these Autotask resources:

#### Companies
- `autotask://companies` - List all companies
- `autotask://companies/{id}` - Get specific company details

#### Contacts
- `autotask://contacts` - List all contacts
- `autotask://contacts/{id}` - Get specific contact details

#### Tickets
- `autotask://tickets` - List all tickets
- `autotask://tickets/{id}` - Get specific ticket details

#### Time Entries
- `autotask://time-entries` - List all time entries

### Available MCP Tools

Claude can perform these actions via 35 MCP tools. Key operations include:

- **autotask_search_companies** / **autotask_create_company** / **autotask_update_company**
- **autotask_search_contacts** / **autotask_create_contact**
- **autotask_search_tickets** / **autotask_get_ticket_details** / **autotask_create_ticket**
- **autotask_create_time_entry**
- **autotask_search_projects** / **autotask_create_project**
- **autotask_search_resources**
- Notes: ticket, project, and company notes (get/search/create)
- Attachments: **autotask_get_ticket_attachment** / **autotask_search_ticket_attachments**
- Financial: expense reports, quotes, invoices, contracts
- **autotask_search_configuration_items** / **autotask_search_tasks** / **autotask_create_task**
- **autotask_test_connection**: Verify Autotask API connectivity

See [API Reference](#api-reference) for the full list.

### Example Usage Scenarios

#### 1. Ticket Management
```
Claude, show me all open tickets assigned to John Doe and create a summary report
```

#### 2. Customer Information
```
Find the contact information for ACME Corporation and show me their recent tickets
```

#### 3. Time Tracking
```
Create a time entry for 2 hours of work on ticket #12345 with description "Database optimization"
```

#### 4. Company Analysis
```
Show me all companies created in the last 30 days and their primary contacts
```

### Troubleshooting Claude Integration

#### Connection Issues

**Problem**: MCP server not appearing in Claude
**Solutions**:
1. Check configuration file syntax (valid JSON)
2. Verify file path in the configuration
3. Ensure environment variables are set correctly
4. Restart Claude Desktop completely

**Problem**: Authentication errors
**Solutions**:
1. Verify Autotask credentials are correct
2. Check API user permissions in Autotask
3. Ensure integration code is valid

**Problem**: "Invalid JSON-RPC message: [dotenv@...] injecting env" / Server disconnected
**Cause**: The `autotask-node` library calls `dotenv.config()` at module load time. dotenv v17+ writes status messages via `console.log` to stdout, which corrupts the MCP stdio JSON-RPC channel.
**Solution**: Ensure you're using `dist/entry.js` (not `dist/index.js`) as the entry point. The entry wrapper redirects `console.log` to stderr before any libraries load.

#### Performance Issues

**Problem**: Slow responses from Claude
**Solutions**:
1. Check network connectivity to Autotask API
2. Monitor server logs for performance bottlenecks
3. Consider implementing caching for frequently accessed data

#### Debug Mode

Enable debug logging for troubleshooting:

```json
{
  "mcpServers": {
    "autotask": {
      "command": "node",
      "args": ["/path/to/autotask-mcp/dist/entry.js"],
      "env": {
        "AUTOTASK_USERNAME": "your-username",
        "AUTOTASK_SECRET": "your-secret",
        "AUTOTASK_INTEGRATION_CODE": "your-code",
        "LOG_LEVEL": "debug"
      }
    }
  }
}
```

### Security Considerations

#### Credential Management
- Store credentials in environment variables, not directly in config
- Use `.env` files for local development
- Consider using secrets management for production

#### Network Security
- Run MCP server in isolated network environments
- Use HTTPS for all API communications
- Monitor and log all API access

#### Access Control
- Limit Autotask API user permissions to minimum required
- Regular rotation of API credentials
- Monitor API usage patterns

## Development

### Setup

```bash
git clone https://github.com/asachs01/autotask-mcp.git
cd autotask-mcp
npm install
```

### Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run test         # Run test suite
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
```

### Project Structure

```
autotask-mcp/
├── src/
│   ├── handlers/           # MCP request handlers
│   ├── mcp/               # MCP server implementation
│   ├── services/          # Autotask service layer
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions (config, logger, cache)
│   ├── entry.ts           # Entry point (stdout guard + .env loader)
│   └── index.ts           # Server bootstrap (config, logger, server init)
├── tests/                 # Test files
├── scripts/               # Build and packaging scripts
│   └── pack-mcpb.js       # MCPB bundle creation
├── manifest.json          # MCPB manifest for desktop distribution
├── Dockerfile             # Container definition (HTTP transport)
├── docker-compose.yml     # Multi-service orchestration
└── package.json          # Project configuration
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run specific test file
npm test -- tests/autotask-service.test.ts
```

### Test Categories

- **Unit Tests**: Service layer and utility functions
- **Integration Tests**: MCP protocol compliance
- **API Tests**: Autotask API integration (requires credentials)

### Coverage Requirements

- Minimum 80% coverage for all metrics
- 100% coverage for critical paths (authentication, data handling)

## Configuration Reference

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `AUTOTASK_USERNAME` | ✅ | - | Autotask API username (email) |
| `AUTOTASK_SECRET` | ✅ | - | Autotask API secret key |
| `AUTOTASK_INTEGRATION_CODE` | ✅ | - | Autotask integration code |
| `AUTOTASK_API_URL` | ❌ | Auto-detected | Autotask API endpoint URL |
| `MCP_SERVER_NAME` | ❌ | `autotask-mcp` | MCP server name |
| `MCP_TRANSPORT` | ❌ | `stdio` | Transport type (`stdio` or `http`) |
| `MCP_HTTP_PORT` | ❌ | `8080` | HTTP transport port |
| `MCP_HTTP_HOST` | ❌ | `0.0.0.0` | HTTP transport bind address |
| `LOG_LEVEL` | ❌ | `info` | Logging level |
| `LOG_FORMAT` | ❌ | `simple` | Log output format |
| `NODE_ENV` | ❌ | `development` | Node.js environment |

### Logging Levels

- `error`: Only error messages
- `warn`: Warnings and errors
- `info`: General information, warnings, and errors
- `debug`: Detailed debugging information

### Log Formats

- `simple`: Human-readable console output
- `json`: Structured JSON output (recommended for production)

## Troubleshooting

### Common Issues

#### Authentication Errors

```
Error: Missing required Autotask credentials
```
**Solution**: Ensure all required environment variables are set correctly.

#### Connection Timeouts

```
Error: Connection to Autotask API failed
```
**Solutions**:
- Check network connectivity
- Verify API endpoint URL
- Confirm API user has proper permissions

#### Permission Denied

```
Error: User does not have permission to access this resource
```
**Solution**: Review Autotask API user permissions and security level settings.

### Debug Mode

Enable debug logging for detailed troubleshooting:

```bash
LOG_LEVEL=debug npm start
```

### Health Checks

Test server connectivity:

```bash
# Run test suite
npm run test

# For HTTP transport, check the health endpoint
curl http://localhost:8080/health
# Returns: {"status":"ok"}

# Test API connection with debug logging
LOG_LEVEL=debug npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Maintain test coverage above 80%
- Use conventional commit messages
- Update documentation for API changes
- Add tests for new features

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributors

| Avatar | Name | Contributions |
| --- | --- | --- |
| <a href="https://github.com/asachs01"><img src="https://github.com/asachs01.png" width="60" /></a> | [@asachs01](https://github.com/asachs01) | Maintainer |
| <a href="https://github.com/Baphomet480"><img src="https://github.com/Baphomet480.png" width="60" /></a> | [@Baphomet480](https://github.com/Baphomet480) | CLI bin fix |

## Support

- 📚 [Documentation](https://github.com/asachs01/autotask-mcp/wiki)
- 🐛 [Issue Tracker](https://github.com/asachs01/autotask-mcp/issues)
- 💬 [Discussions](https://github.com/asachs01/autotask-mcp/discussions)

## Acknowledgments

- [Model Context Protocol](https://modelcontextprotocol.io/) by Anthropic
- [Autotask REST API](https://ww3.autotask.net/help/DeveloperHelp/Content/APIs/REST/REST_API_Home.htm) by Kaseya
- [autotask-node](https://www.npmjs.com/package/autotask-node) library

---

Built with ❤️ for the Autotask and AI community 