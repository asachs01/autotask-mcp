# Multi-stage build for efficient container size
FROM node:18-alpine AS builder

# Build arguments
ARG VERSION="unknown"
ARG COMMIT_SHA="unknown"
ARG BUILD_DATE="unknown"

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Create a non-root user for security
RUN addgroup -g 1001 -S autotask && \
    adduser -S autotask -u 1001 -G autotask

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Create logs directory
RUN mkdir -p /app/logs && chown -R autotask:autotask /app

# Switch to non-root user
USER autotask

# Expose port (if needed for future HTTP interface)
EXPOSE 8080

# Health check against the actual HTTP endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Set environment variables
ENV NODE_ENV=production
ENV LOG_LEVEL=info
ENV LOG_FORMAT=json
ENV MCP_TRANSPORT=http
ENV MCP_HTTP_PORT=8080
ENV MCP_HTTP_HOST=0.0.0.0

# Define volume for logs
VOLUME ["/app/logs"]

# Start the application directly (HTTP transport doesn't need the stdio wrapper)
CMD ["node", "dist/index.js"]

# Build arguments for runtime
ARG VERSION="unknown"
ARG COMMIT_SHA="unknown" 
ARG BUILD_DATE="unknown"

# Labels for metadata
LABEL maintainer="autotask-mcp@example.com"
LABEL version="${VERSION}"
LABEL description="Autotask MCP Server - Model Context Protocol server for Kaseya Autotask PSA"
LABEL org.opencontainers.image.title="autotask-mcp"
LABEL org.opencontainers.image.description="Model Context Protocol server for Kaseya Autotask PSA integration"
LABEL org.opencontainers.image.version="${VERSION}"
LABEL org.opencontainers.image.created="${BUILD_DATE}"
LABEL org.opencontainers.image.revision="${COMMIT_SHA}"
LABEL org.opencontainers.image.source="https://github.com/asachs01/autotask-mcp"
LABEL org.opencontainers.image.documentation="https://github.com/asachs01/autotask-mcp/blob/main/README.md"
LABEL org.opencontainers.image.url="https://github.com/asachs01/autotask-mcp/pkgs/container/autotask-mcp"
LABEL org.opencontainers.image.vendor="Autotask MCP"
LABEL org.opencontainers.image.licenses="MIT" 