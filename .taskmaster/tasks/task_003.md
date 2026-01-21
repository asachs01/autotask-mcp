# Task ID: 3

**Title:** Implement Environment Configuration System

**Status:** done

**Dependencies:** 2 ✓

**Priority:** high

**Description:** Create configuration management for Autotask API credentials and server settings using environment variables

**Details:**

Create config.ts in utils/ to load and validate environment variables: AUTOTASK_USERNAME, AUTOTASK_SECRET, AUTOTASK_INTEGRATION_CODE (required), AUTOTASK_API_URL, MCP_SERVER_NAME, MCP_SERVER_VERSION, LOG_LEVEL, LOG_FORMAT, NODE_ENV (optional). Use dotenv for .env file support. Implement validation with descriptive error messages for missing required variables.

**Test Strategy:**

Unit tests for config validation with missing/present environment variables, verify default values are applied correctly
