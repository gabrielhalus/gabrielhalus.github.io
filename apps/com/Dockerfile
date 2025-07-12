# Install dependencies
FROM oven/bun:1.1 AS deps
WORKDIR /app
COPY ../../bun.lock ./package.json ./
RUN bun install --frozen-lockfile

# Build app
FROM oven/bun:1.1 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build


# Production image
FROM oven/bun:1.1 AS runner
WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production
EXPOSE 3000
CMD ["bun", "start"]
