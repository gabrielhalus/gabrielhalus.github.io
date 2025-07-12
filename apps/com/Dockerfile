# Install dependencies
FROM oven/bun:1.2 AS deps
WORKDIR /app
COPY ../../bun.lock ../../package.json ./
COPY package.json ./apps/com/package.json
RUN bun install

# Build app with Bun (install Node.js for Next.js SWC)
FROM oven/bun:1.2 AS builder
WORKDIR /app
COPY ../../bun.lock ../../package.json ./
COPY package.json ./apps/com/package.json
COPY . .

# Install Node.js for Next.js SWC compilation
RUN apt-get update && apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs

# Reinstall dependencies to get correct native binaries for the current platform
RUN bun install

ENV NEXT_TELEMETRY_DISABLED=1
RUN bun run build

# Production image
FROM oven/bun:1.2 AS runner
WORKDIR /app

COPY --from=builder /app/apps/com/.next ./.next
COPY --from=builder /app/apps/com/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
EXPOSE 3000
CMD ["bun", "start"]
