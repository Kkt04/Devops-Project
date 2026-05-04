# ─────────────────────────────────────────────────────────────
# Stage 1: Build
# Installs all deps, builds frontend for static serving
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

# Copy server and client package files to correct subdirectories
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install all dependencies
RUN cd server && npm install && cd .. && \
    cd client && npm install --legacy-peer-deps && cd ..

# Copy source code
COPY server/ ./server/
COPY client/ ./client/

# Build frontend (Vite) and copy to server/public for serving
RUN cd client && npm run build && \
    mkdir -p ../server/public && \
    cp -r dist/* ../server/public/

# ─────────────────────────────────────────────────────────────
# Stage 2: Runtime
# Lean production image — no dev tools, non-root user
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS runtime

# Create non-root user
RUN addgroup -S artisan && \
    adduser -S artisan -G artisan

WORKDIR /app

# Copy only production dependencies
COPY --from=build /app/server/package*.json ./
RUN npm install --prefix ./ --omit=dev

# Copy built application
COPY --from=build /app/server/src ./src
COPY --from=build /app/server/public ./public

# Give non-root user ownership
RUN chown -R artisan:artisan /app

USER artisan

EXPOSE 5001

# ECS uses this healthcheck to decide when the container is ready
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://localhost:5001/api/health || exit 1

CMD ["node", "src/index.js"]