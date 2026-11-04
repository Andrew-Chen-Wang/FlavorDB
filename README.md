# Flavor DB

A website that showcases all the world's dishes, as completely as possible, along with their local variations.

Each dish comes with:

- **A little history**: where it came from and how it developed.
- **Where it can be found**: the regions and countries where the dish is eaten today. Flavor DB doesn't take sides in origin disputes, such as Venezuela vs. Colombia over the arepa or Japan vs. China over mochi. It lists every place the dish belongs to.
- **Local variations**: how the dish changes from place to place.
- **Recipes**: one or more recipes, where available. When no recipe can be found, the dish at least lists its ingredients.
- **Similar dishes**, linked in two ways:
  - **Flavor profile**: dishes that taste alike.
  - **Recipe fundamentals**: dishes made the same basic way, even when the flavors differ. For example, the tamale and China's zongzi are both fillings wrapped in leaves and steamed.

## Ingredient graph

Dishes and ingredients are linked in a graph, so you can pick an ingredient and see every recipe that uses it.

## Development

Stack: Next.js, ShadCN, Tailwind, Hono, Kysely, PostgreSQL, Vitest. Based on
[template-nextjs](https://github.com/Andrew-Chen-Wang/template-nextjs), with authentication removed.

```shell
pnpm install
cp .template.env .env
pnpm run --dir apps/website dev     # website + API mounted at /api
pnpm run --dir apps/internal-api dev # standalone API on :3001 (optional)
```

The database (`packages/db`, `apps/dbmigrator`, `lib/typescript/dao`) is set up but has no
migrations and isn't used by the website yet. When you're ready:

```shell
docker-compose up -d
cd apps/dbmigrator/src && pnpm dlx kysely migrate:make <name>
pnpm --filter=dbmigrator run migrate:latest
pnpm --filter=@flavor-db/db run db-codegen
```

See [AGENTS.md](AGENTS.md) for more commands and the repo layout.

## Deployment

The website deploys to Vercel as the `flavordb` project with `apps/website` as the root directory.
