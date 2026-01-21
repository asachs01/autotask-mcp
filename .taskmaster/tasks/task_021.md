# Task ID: 21

**Title:** Set up CI/CD Pipeline and GitHub Container Registry

**Status:** done

**Dependencies:** 20 ✓

**Priority:** low

**Description:** Configure GitHub Actions for automated testing, building, and publishing to GitHub Container Registry

**Details:**

Create .github/workflows/ci.yml for automated testing on pull requests. Add build-and-publish.yml workflow for creating Docker images and publishing to ghcr.io/asachs01/autotask-mcp. Include automated NPM package publishing on releases. Set up semantic versioning and changelog generation.

**Test Strategy:**

Test CI pipeline runs on commits, Docker images build and publish correctly, NPM package publishes on release
