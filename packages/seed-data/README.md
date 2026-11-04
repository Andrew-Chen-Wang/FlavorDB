# @flavor-db/seed-data

Hand-curated starter data for Flavor DB, kept in TypeScript until the database schema exists.

- `src/places.ts`: countries, regions and cities, with coordinates for the map
- `src/ingredients.ts`: the ingredient graph's nodes
- `src/dishes/`: dishes from the US (`us.ts`), Michigan (`michigan.ts`), and China (`china.ts`, which
  also holds the Wuhan, Sichuan and Shangrao dishes)
- `src/index.ts`: everything above, plus the two similarity measures:
  - **flavor**: cosine similarity of flavor profiles after subtracting the average dish
  - **recipe fundamentals**: weighted overlap of techniques, where rare techniques such as
    `leaf-wrapped` count for more than common ones such as `baked`

Entries marked as a starting point (for example Shangrao chao fen and braised pomelo peel) need
details from people who cook them.
