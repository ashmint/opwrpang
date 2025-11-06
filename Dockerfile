# ---------- builder ----------
FROM node:22-bookworm-slim AS builder
WORKDIR /app

ARG BUILD=oss
ARG DATABASE=sqlite

COPY package*.json ./
RUN npm ci

COPY . .

# generate db index & build flag
RUN echo "export * from \"./$DATABASE\";" > server/db/index.ts
RUN echo "export const build = \"$BUILD\" as any;" > server/build.ts

# drizzle init (sqlite by default)
RUN if [ "$DATABASE" = "pg" ]; then \
      npx drizzle-kit generate --dialect postgresql --schema ./server/db/pg/schema.ts --out init; \
    else \
      npx drizzle-kit generate --dialect $DATABASE --schema ./server/db/$DATABASE/schema.ts --out init; \
    fi

RUN npm run build:$DATABASE
RUN npm run build:cli

# prune dev deps so we copy a lean runtime node_modules
RUN npm prune --omit=dev


# ---------- runner ----------
FROM node:22-bookworm-slim AS runner
WORKDIR /app

# CLI used by the startup guard (tiny)
RUN apt-get update && apt-get install -y --no-install-recommends sqlite3 curl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# bring exactly what we built
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next/standalone ./        # Next standalone server
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/init ./dist/init
COPY --from=builder /app/package*.json ./

# CLI wrapper you already had
COPY ./cli/wrapper.sh /usr/local/bin/pangctl
RUN chmod +x /usr/local/bin/pangctl ./dist/cli.mjs

# names.json + public
COPY server/db/names.json ./dist/names.json
COPY public ./public

# add a tiny guard to fix old-DBs before migrations
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# keep DB in a volume
VOLUME ["/app/data"]

ENV NODE_ENV=production
ENV ENVIRONMENT=prod

ENTRYPOINT ["/entrypoint.sh"]
# after guard runs, it calls your existing npm start
