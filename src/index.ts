#!/usr/bin/env node

// Main Entry Point for Autotask MCP Server
// Initializes configuration, logging, and starts the MCP server

import { AutotaskMcpServer } from './mcp/server.js';
import { Logger } from './utils/logger.js';
import { loadEnvironmentConfig, mergeWithMcpConfig } from './utils/config.js';

async function main() {
  let logger: Logger | undefined;

  try {
    // Load configuration
    const envConfig = loadEnvironmentConfig();
    const mcpConfig = mergeWithMcpConfig(envConfig);

    // Initialize logger
    logger = new Logger(envConfig.logging.level, envConfig.logging.format);
    logger.info('Starting Autotask MCP Server...');
    logger.debug('Configuration loaded', { 
      serverName: mcpConfig.name, 
      serverVersion: mcpConfig.version,
      hasCredentials: !!(mcpConfig.autotask.username && mcpConfig.autotask.secret && mcpConfig.autotask.integrationCode)
    });

    // Validate required configuration
    if (!mcpConfig.autotask.username || !mcpConfig.autotask.secret || !mcpConfig.autotask.integrationCode) {
      throw new Error('Missing required Autotask credentials. Please set AUTOTASK_USERNAME, AUTOTASK_SECRET, and AUTOTASK_INTEGRATION_CODE environment variables.');
    }

    // Create the MCP server (don't initialize Autotask yet)
    const server = new AutotaskMcpServer(mcpConfig, logger, envConfig);

    // Set up graceful shutdown
    process.on('SIGINT', async () => {
      logger!.info('Received SIGINT, shutting down gracefully...');
      await server.stop();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      logger!.info('Received SIGTERM, shutting down gracefully...');
      await server.stop();
      process.exit(0);
    });

    // Start the server
    await server.start();

  } catch (error) {
    if (logger) {
      logger.error('Failed to start Autotask MCP Server:', error);
    } else {
      console.error('Failed to start Autotask MCP Server:', error);
    }
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start the server
main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
}); 