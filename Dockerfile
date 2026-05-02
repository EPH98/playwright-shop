# ─────────────────────────────────────────────────────────────────────────────
# Stage 1 — deps
#   Install only production dependencies so they can be cached separately.
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev


# ─────────────────────────────────────────────────────────────────────────────
# Stage 2 — builder
#   Install ALL dependencies (including devDeps for TypeScript etc.) and build.
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

# next.config.js is set to output:'standalone' so the build artefact is
# self-contained and does not require a full node_modules directory at runtime.
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build


# ─────────────────────────────────────────────────────────────────────────────
# Stage 3 — runner
#   Minimal production image using only the standalone output.
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

# Copy the standalone build and static assets
COPY --from=builder /app/public                          ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static    ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
