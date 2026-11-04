## Build Commands

```bash
# Install dependencies
pnpm install

# Start development server (website + API)
pnpm --filter=website run dev

# Run all tests
pnpm test

# Run a single test file
pnpm dlx vitest run path/to/file.test.ts --config .config/vitest.config.mts

# Lint and format
pnpm run format        # Oxfmt format with .config/oxfmt.config.ts
pnpm run lint          # Oxlint check with auto-fix

# Database
docker-compose up -d                              # Start PostgreSQL
pnpm --filter=dbmigrator run migrate:latest     # Run migrations
pnpm --filter=@flavor-db/db run db-codegen       # Generate Kysely types

# Create new migration
cd apps/dbmigrator/src && pnpm dlx kysely migrate:make <name>

# Generate OpenAPI client (requires dev server running)
pnpm --filter=website run openapi
```

## Architecture

This is a TypeScript monorepo with npm workspaces:

**Apps:**

- `apps/website` - Next.js frontend with Tailwind/ShadCN UI. API routes are proxied through `/api`
- `apps/internal-api` - Hono API with TypeBox schemas and OpenAPI generation. Mounted at `/api` via Next.js
- `apps/dbmigrator` - Kysely database migrations

**Packages:**

- `packages/db` - Kysely database client and generated types (`@flavor-db/db`)
- `lib/typescript/dao` - Data access objects shared between API and website (`@lib/dao`)
- `lib/typescript/utils/*` - Utility libraries (e.g., `@utils/numbers`)
