# Task ID: 24

**Title:** Fix MaxRecords casing bug in autotask-node library

**Status:** done

**Dependencies:** None

**Priority:** high

**Description:** Update all list() methods in autotask-node entity files to use 'maxRecords' (lowercase m) instead of 'MaxRecords' to match Autotask REST API expectations and fix pagination issues.

**Details:**

Review and update the following confirmed files: src/entities/accounts.ts line 187, src/entities/contacts.ts line 197, src/entities/resources.ts line 183. Search entire src/entities/ directory for all other .ts files containing 'MaxRecords' in list() methods and replace with 'maxRecords'. Ensure the parameter is passed correctly in query parameters for pagination (e.g., { maxRecords: 500 }). Verify no other casing-sensitive parameters are affected by cross-referencing Autotask REST API documentation. Update any related type definitions or interfaces if 'MaxRecords' appears there. Commit changes with reference to GitHub Issues #3, #8, #9. Run full project build and linting after changes.

**Test Strategy:**

Manually test list() methods on affected entities (Accounts, Contacts, Resources) with pagination by setting maxRecords to 10 and verifying API returns exactly 10 records without excessive calls. Test with larger values (500) to confirm pagination works end-to-end. Run integration tests against live Autotask API if available, monitoring API call counts. Verify no regressions in other entity list() methods by testing at least 5 unaffected entities. Confirm build succeeds and no TypeScript errors. Check GitHub Issues #3, #8, #9 are resolvable post-fix.
