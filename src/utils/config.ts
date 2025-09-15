// Configuration Utility
// Handles loading configuration from environment variables and MCP client arguments

import { McpServerConfig } from '../types/mcp.js';
import { LogLevel } from './logger.js';
import { TransportConfig } from '../transport/index';

export interface EnvironmentConfig {
  autotask: {
    username?: string;
    secret?: string;
    integrationCode?: string;
    apiUrl?: string;
  };
  server: {
    name: string;
    version: string;
  };
  logging: {
    level: LogLevel;
    format: 'json' | 'simple';
  };
  transport: TransportConfig;
}

/**
 * Load configuration from environment variables
 */
export function loadEnvironmentConfig(): EnvironmentConfig {
  const autotaskConfig: { username?: string; secret?: string; integrationCode?: string; apiUrl?: string } = {};
  
  if (process.env.AUTOTASK_USERNAME) {
    autotaskConfig.username = process.env.AUTOTASK_USERNAME;
  }
  if (process.env.AUTOTASK_SECRET) {
    autotaskConfig.secret = process.env.AUTOTASK_SECRET;
  }
  if (process.env.AUTOTASK_INTEGRATION_CODE) {
    autotaskConfig.integrationCode = process.env.AUTOTASK_INTEGRATION_CODE;
  }
  if (process.env.AUTOTASK_API_URL) {
    autotaskConfig.apiUrl = process.env.AUTOTASK_API_URL;
  }

  // Default to stdio for backward compatibility
  const transportType = (process.env.AUTOTASK_TRANSPORT as any) || 'stdio';

  return {
    autotask: autotaskConfig,
    server: {
      name: process.env.MCP_SERVER_NAME || 'autotask-mcp',
      version: process.env.MCP_SERVER_VERSION || '1.0.0'
    },
    logging: {
      level: (process.env.LOG_LEVEL as LogLevel) || 'info',
      format: (process.env.LOG_FORMAT as 'json' | 'simple') || 'simple'
    },
    transport: {
      type: transportType,
      http: {
        port: parseInt(process.env.AUTOTASK_HTTP_PORT || '3000'),
        host: process.env.AUTOTASK_HTTP_HOST || 'localhost',
        auth: {
          enabled: process.env.AUTOTASK_HTTP_AUTH === 'true',
          ...(process.env.AUTOTASK_HTTP_USERNAME && { username: process.env.AUTOTASK_HTTP_USERNAME }),
          ...(process.env.AUTOTASK_HTTP_PASSWORD && { password: process.env.AUTOTASK_HTTP_PASSWORD })
        }
      }
    }
  };
}

/**
 * Merge environment config with MCP client configuration
 */
export function mergeWithMcpConfig(envConfig: EnvironmentConfig, mcpArgs?: Record<string, any>): McpServerConfig {
  // MCP client can override server configuration through arguments
  const serverConfig: McpServerConfig = {
    name: mcpArgs?.name || envConfig.server.name,
    version: mcpArgs?.version || envConfig.server.version,
    autotask: {
      username: mcpArgs?.autotask?.username || envConfig.autotask.username,
      secret: mcpArgs?.autotask?.secret || envConfig.autotask.secret,
      integrationCode: mcpArgs?.autotask?.integrationCode || envConfig.autotask.integrationCode,
      apiUrl: mcpArgs?.autotask?.apiUrl || envConfig.autotask.apiUrl
    }
  };

  return serverConfig;
}

/**
 * Validate that all required configuration is present
 */
export function validateConfig(config: McpServerConfig): string[] {
  const errors: string[] = [];

  if (!config.autotask.username) {
    errors.push('AUTOTASK_USERNAME is required');
  }

  if (!config.autotask.secret) {
    errors.push('AUTOTASK_SECRET is required');
  }

  if (!config.autotask.integrationCode) {
    errors.push('AUTOTASK_INTEGRATION_CODE is required');
  }

  if (!config.name) {
    errors.push('Server name is required');
  }

  if (!config.version) {
    errors.push('Server version is required');
  }

  return errors;
}

/**
 * Get configuration help text
 */
export function getConfigHelp(): string {
  return `
Autotask MCP Server Configuration:

Required Environment Variables:
  AUTOTASK_USERNAME         - Autotask API username (email)
  AUTOTASK_SECRET          - Autotask API secret key
  AUTOTASK_INTEGRATION_CODE - Autotask integration code

Optional Environment Variables:
  AUTOTASK_API_URL         - Autotask API base URL (auto-detected if not provided)
  MCP_SERVER_NAME          - Server name (default: autotask-mcp)
  MCP_SERVER_VERSION       - Server version (default: 1.0.0)
  LOG_LEVEL                - Logging level: error, warn, info, debug (default: info)
  LOG_FORMAT               - Log format: simple, json (default: simple)

Transport Configuration:
  AUTOTASK_TRANSPORT       - Transport type: stdio, http, both (default: stdio)
  AUTOTASK_HTTP_PORT       - HTTP port (default: 3000)
  AUTOTASK_HTTP_HOST       - HTTP host (default: localhost)
  AUTOTASK_HTTP_AUTH       - Enable HTTP auth: true, false (default: false)
  AUTOTASK_HTTP_USERNAME   - HTTP auth username
  AUTOTASK_HTTP_PASSWORD   - HTTP auth password

Example:
  AUTOTASK_USERNAME=api-user@example.com
  AUTOTASK_SECRET=your-secret-key
  AUTOTASK_INTEGRATION_CODE=your-integration-code
`.trim();
} 