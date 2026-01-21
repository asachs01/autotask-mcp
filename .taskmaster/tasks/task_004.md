# Task ID: 4

**Title:** Set up Structured Logging System

**Status:** done

**Dependencies:** 3 ✓

**Priority:** medium

**Description:** Implement configurable logging with support for different levels and formats (simple/JSON)

**Details:**

Create logger.ts in utils/ using winston or similar library. Support LOG_LEVEL (error, warn, info, debug) and LOG_FORMAT (simple, json). Simple format for development console output, JSON format for production structured logging. Include timestamp, level, message, and optional metadata fields.

**Test Strategy:**

Test different log levels are filtered correctly, JSON format produces valid JSON, simple format is human-readable
