# Autotask MCP Server

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server that provides AI assistants with structured access to Kaseya Autotask PSA data and operations.

## 🚀 Quick Start

**Want to connect to Claude Desktop in 5 minutes?** See our [Quick Start Guide for Claude Desktop](QUICK_START_CLAUDE.md)!

## Features

- **🔌 MCP Protocol Compliance**: Full support for MCP resources and tools
- **🛠️ Comprehensive API Coverage**: Access to companies, contacts, tickets, time entries, and more
- **🔍 Advanced Search**: Powerful search capabilities with filters across all entities
- **📝 CRUD Operations**: Create, read, update operations for core Autotask entities
- **🔄 ID-to-Name Mapping**: Automatic resolution of company and resource IDs to human-readable names
- **⚡ Intelligent Caching**: Smart caching system for improved performance and reduced API calls
- **🔒 Secure Authentication**: Enterprise-grade API security with Autotask credentials
- **🐳 Docker Ready**: Containerized deployment with Docker and docker-compose
- **📊 Structured Logging**: Comprehensive logging with configurable levels and formats
- **🧪 Test Coverage**: Comprehensive test suite with 80%+ coverage

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Reference](#api-reference)
- [ID-to-Name Mapping](#id-to-name-mapping)
- [Docker Deployment](#docker-deployment)
- [Claude Desktop Integration](#claude-desktop-integration)
- [Development](#development)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Installation

### Prerequisites

- Node.js 18+ (LTS recommended)
- Valid Autotask API credentials
- MCP-compatible client (Claude Desktop, Continue, etc.)

### NPM Installation

```bash
npm install -g autotask-mcp
```

### From Source

```bash
git clone https://github.com/asachs01/autotask-mcp.git
cd autotask-mcp
npm install
npm run build
```

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
MCP_SERVER_VERSION=1.0.0

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
# Start the MCP server
autotask-mcp

# Start with custom configuration
AUTOTASK_USERNAME=user@example.com autotask-mcp
```

### MCP Client Configuration

Add to your MCP client configuration (e.g., Claude Desktop):

```json
{
  "mcpServers": {
    "autotask": {
      "command": "autotask-mcp",
      "env": {
        "AUTOTASK_USERNAME": "your-api-user@example.com",
        "AUTOTASK_SECRET": "your-secret-key",
        "AUTOTASK_INTEGRATION_CODE": "your-integration-code"
      }
    }
  }
}
```

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

Tools provide interactive operations:

#### Company Operations
- `autotask_search_companies` - Search companies with filters
- `autotask_create_company` - Create new company
- `autotask_update_company` - Update existing company

#### Contact Operations  
- `autotask_search_contacts` - Search contacts with filters
- `autotask_create_contact` - Create new contact

#### Ticket Operations
- `autotask_search_tickets` - Search tickets with filters
- `autotask_create_ticket` - Create new ticket

#### Time Entry Operations
- `autotask_create_time_entry` - Log time entry

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

### Mapping Tools

Additional tools are available for direct ID-to-name resolution:

- **`get_company_name`** - Get company name by ID
- **`get_resource_name`** - Get resource (user) name by ID  
- **`get_mapping_cache_stats`** - View cache statistics
- **`clear_mapping_cache`** - Clear cached mappings
- **`preload_mapping_cache`** - Preload cache for better performance

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

## Docker Deployment

### Using Pre-built Image from GitHub Container Registry

```bash
# Pull the latest image
docker pull ghcr.io/asachs01/autotask-mcp:latest

# Run container with your credentials
docker run -d \
  --name autotask-mcp \
  -e AUTOTASK_USERNAME="your-api-user@example.com" \
  -e AUTOTASK_SECRET="your-secret-key" \
  -e AUTOTASK_INTEGRATION_CODE="your-integration-code" \
  --restart unless-stopped \
  ghcr.io/asachs01/autotask-mcp:latest
```

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

**For Local Development:**
```json
{
  "mcpServers": {
    "autotask": {
      "command": "node",
      "args": ["/path/to/autotask-mcp/dist/index.js"],
      "env": {
        "AUTOTASK_USERNAME": "your-api-username@company.com",
        "AUTOTASK_SECRET": "your-api-secret",
        "AUTOTASK_INTEGRATION_CODE": "your-integration-code"
      }
    }
  }
}
```

**For Docker Deployment (GitHub Container Registry):**
```json
{
  "mcpServers": {
    "autotask": {
      "command": "docker",
      "args": [
        "run", "--rm", "-i",
        "-e", "AUTOTASK_USERNAME=your-api-username@company.com",
        "-e", "AUTOTASK_SECRET=your-api-secret",
        "-e", "AUTOTASK_INTEGRATION_CODE=your-integration-code",
        "ghcr.io/asachs01/autotask-mcp:latest"
      ]
    }
  }
}
```

**For NPM Global Installation:**
```json
{
  "mcpServers": {
    "autotask": {
      "command": "npx",
      "args": ["autotask-mcp"],
      "env": {
        "AUTOTASK_USERNAME": "your-api-username@company.com",
        "AUTOTASK_SECRET": "your-api-secret",
        "AUTOTASK_INTEGRATION_CODE": "your-integration-code"
      }
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

Claude can perform these actions via MCP tools:

#### Company Operations
- **autotask_search_companies**: Find companies with filters
- **create_company**: Create new companies
- **update_company**: Modify existing companies

#### Contact Operations
- **autotask_search_contacts**: Find contacts with filters
- **create_contact**: Create new contacts

#### Ticket Operations
- **autotask_search_tickets**: Find tickets with filters
- **autotask_create_ticket**: Create new tickets

#### Time Entry Operations
- **create_time_entry**: Log time entries

#### Utility Operations
- **autotask_test_connection**: Verify Autotask API connectivity

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
      "args": ["/path/to/autotask-mcp/dist/index.js"],
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
git clone https://github.com/your-org/autotask-mcp.git
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
│   ├── utils/             # Utility functions
│   └── index.ts           # Main entry point
├── tests/                 # Test files
├── plans/                 # Project documentation (gitignored)
├── prompt_logs/           # Development logs (gitignored)
├── Dockerfile             # Container definition
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
| `MCP_SERVER_VERSION` | ❌ | `1.0.0` | MCP server version |
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
# Test basic functionality
npm run test

# Test API connection (requires credentials)
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