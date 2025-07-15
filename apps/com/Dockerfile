# ---- Base image with Bun and Node.js ----
FROM oven/bun:1.2.18 AS base

# Add Node.js (needed for Next.js internal tools)
RUN apt-get update && \
    apt-get install -y curl ca-certificates gnupg && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    node -v && npm -v

# ---- Dependencies layer ----
FROM base AS deps
WORKDIR /app

# Copy root monorepo files (to install deps for all packages)
COPY bun.lock package.json turbo.json ./
COPY packages ./packages
COPY apps/com/package.json ./apps/com/package.json

RUN bun install --frozen-lockfile

# ---- Build layer ----
FROM base AS builder
WORKDIR /app

# Copy everything
COPY --from=deps /app /app

# Copy source for the app
COPY apps/com ./apps/com

# Disable Next telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# Build the Next.js app
WORKDIR /app/apps/com
RUN bunx next build

# ---- Final runtime image ----
FROM base AS runner
WORKDIR /app

# Set production env
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Create non-root user
RUN adduser --system --uid 1001 nextjs

# Copy the standalone server output and static files
COPY --from=builder --chown=nextjs:bun /app/apps/com/.next/standalone ./
COPY --from=builder --chown=nextjs:bun /app/apps/com/.next/static ./apps/com/.next/static
COPY --from=builder --chown=nextjs:bun /app/apps/com/public ./apps/com/public

USER nextjs

EXPOSE 3000

# Launch the Next.js standalone server
CMD ["node", "apps/com/server.js"]
