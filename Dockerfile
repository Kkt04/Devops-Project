FROM node:20-alpine AS builder

WORKDIR /app
COPY server/package*.json ./
RUN npm ci --only=production
FROM node:20-alpine AS production

RUN addgroup -g 1001 -S nodejs && \
    adduser -S artisan -u 1001 -G nodejs

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules

COPY server/src ./src
COPY server/package.json ./
RUN chown -R artisan:nodejs /app
USER artisan
EXPOSE 5001

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:5001/api/health || exit 1

CMD ["node", "src/index.js"]