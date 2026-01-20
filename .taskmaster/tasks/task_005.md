# Task ID: 5

**Title:** Create Autotask API Service Layer

**Status:** pending

**Dependencies:** 4

**Priority:** high

**Description:** Implement the core Autotask API client with authentication and basic CRUD operations

**Details:**

Create autotask-service.ts in services/ directory. Implement AutotaskService class with methods for authentication using username/secret/integration code. Add methods for companies, contacts, tickets, time entries with GET, POST, PUT operations. Use axios for HTTP requests with proper error handling and timeout configuration. Include retry logic for transient failures.

**Test Strategy:**

Unit tests with mocked HTTP responses, integration tests with test Autotask instance if available, test authentication flow and error handling
