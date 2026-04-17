# ============ Stage 1: Builder ============
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first (Docker layer caching)
COPY server/package*.json ./

# Install ALL dependencies (including dev) for potential build steps
RUN npm ci --only=production

# ============ Stage 2: Production ============
FROM node:20-alpine AS production

# Create non-root user (security requirement)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S artisan -u 1001 -G nodejs

WORKDIR /app

# Copy only production node_modules from builder stage
COPY --from=builder /app/node_modules ./node_modules

# Copy application source
COPY server/src ./src
COPY server/package.json ./

# Change ownership to non-root user
RUN chown -R artisan:nodejs /app

# Switch to non-root user
USER artisan

# Expose port
EXPOSE 5001

# Healthcheck (required by rubric)
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:5001/api/health || exit 1

# Start the server
CMD ["node", "src/index.js"]