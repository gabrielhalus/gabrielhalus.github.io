# Image de production (sortie `standalone` de Next, voir next.config.ts)

FROM node:22-alpine AS base
RUN corepack enable

# Dépendances
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# Build : aucune base n'est joignable ici, le site public est rendu à la demande
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm run build

# Exécution
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Médias envoyés depuis l'admin (volume monté dans docker-compose.yml)
RUN mkdir -p media .next/cache && chown -R nextjs:nodejs media .next

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Les migrations Postgres (src/migrations) s'appliquent au démarrage de Payload
CMD ["node", "server.js"]
