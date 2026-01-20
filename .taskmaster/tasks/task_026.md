# Task ID: 26

**Title:** Fix Search Filter Application in autotask-mcp Service

**Status:** done

**Dependencies:** 24 ✓

**Priority:** high

**Description:** Ensure search filters (searchTerm) are correctly converted to API filters and applied to queries (GitHub Issues #8, #9)

**Details:**

The autotask.service.ts has partial fixes for converting searchTerm to API filters, but there are still issues where filters aren't being applied correctly. Logs show 'filter:[{field:id,op:gte,value:0}]' when a searchTerm should be filtering. Issues: 1) Resources endpoint was using incorrect GET with query params instead of POST query - may need verification this is fixed. 2) The 'items' vs 'value' syntax for OR filters may not match Autotask Swagger spec. 3) Filter construction in searchResources, searchContacts, searchCompanies needs review to ensure filters are passed through correctly to autotask-node. Verify the fixes added for Issue #8/#9 are working correctly end-to-end.

**Test Strategy:**

Test search_contacts with searchTerm 'John Smith' returns only matching contacts, not all contacts. Test search_resources with email filter returns matching resource. Monitor API logs to verify correct filter syntax is being sent. Create integration tests with real or mocked API.
