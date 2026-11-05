# Per-dish review completed

All 31,832 baseline dishes have one verdict across 675 files (`names-000`–`names-058` and
`r-000`–`r-615`). All 378 inputs in the historical pending list have been read and completed.
Dishes and recipes were judged by readers, not by scripts or keyword rules. Scripts perform
bookkeeping, transcription, structural validation, positional matching, and application only.

Every removal, country override, and name override in the original review received a second check.
Exact audit coverage and corrections are recorded in `audits/`, `old-recipes-120-159.md`, and `audit-old.md`.
Tırşik çorbası and Errötendes Mädchen were restored. Prepared foods and traditional products
remain; plain ingredients without recipes, drinks, brands, technique pages and nonfood pages
were removed. Countries describe the dish and include shared associations. The name audit covers
all original name overrides; the country follow-up independently checked additional name changes.

## Required country policy and follow-up review

Every kept output dish must have at least one country. Reviewers first use where the dish comes
from or is commonly said to belong, including every established association for disputed or shared
dishes. A recognizable foreign dish keeps that identity regardless of the cookbook's language.
For a generic dish without a single origin, reviewers use the cuisine of this particular version:
for example, a Hungarian home preparation is HU and a HowToCook home preparation is CN. Only as a
last resort may a name's language identify a clearly dominant country. An entry that cannot be
placed at all is removed with an explanation. Ingredients, recipe techniques and worldwide
popularity alone do not establish additional countries.

The follow-up covers **10,394 previously countryless dishes and two special cases**. Readers
manually inspect each whole original entry and every supplied raw recipe excerpt, record the first
decision in `audits/countries-first-*.jsonl`, and independently reread the country or removal
decision for `audits/countries-second-*.jsonl`. Scripts check coverage and structure only; they do
not choose countries. Both passes are complete: **10,396/10,396 records in each**, with zero
positional or consistency errors. The independent second pass corrected 643 decisions, including
29 newly removed non-dish/technique/beverage entries and 10 restored real foods. The final
follow-up decisions remove 186 previously kept entries; the remaining targets have countries.

The HowToCook chickpea recipe is North Indian **chole bhature**, with chickpea curry and separately
fried breads, not falafel. The user confirmed IN; its clarified name is
`鹰嘴豆咖喱配炸饼（Chole bhature）`. Simit retains TR, GR, CY and BG, rather than the imported EG.
Errötendes Mädchen remains a real German dessert with DE.

Final ISO-code QA also prompted two readers to inspect 12 original entries retaining obsolete
SU/DD codes. Eleven foods received modern country associations; Snezhok was removed as a
fermented milk drink. The separate `countries-historical-first.jsonl` and
`countries-historical-second.jsonl` ledgers preserve those decisions. Existing XK denotes Kosovo
and is retained as a commonly used code, rather than substituting another country.

## Applied results

The fetch cache is absent, so verdicts are applied directly to checked-in shards using the same
code used by `build-data`, after restoring immutable baseline `9333faf`. The output contains
**29,987 dishes and 14,322 recipes; every dish has at least one country**.

| Applied change                                              |  Count |
| ----------------------------------------------------------- | -----: |
| Dishes removed                                              |  1,845 |
| …after their last recipe was dropped, without a Wikidata ID |     48 |
| Dishes renamed                                              |    314 |
| Country lists changed                                       | 19,081 |
| Recipes fixed                                               |  1,857 |
| Recipes dropped                                             |     81 |

These fresh application counts are also recorded in `data/REVIEW.md` and `data/STATS.md`.

Application counts measure changes to the data, not merely the presence of an override. Recipes
belonging to removed dishes are excluded from recipe-fix/drop counts. `data/review-application.json`
records the verdict and output hashes and counts; rerunning the command with identical inputs is
a no-op. Revised verdicts require restoring baseline shards or rebuilding from the fetch cache.

## Validation and evidence

- `pnpm --filter=@flavor-db/world-dishes run review:check`: JSON, required metadata reasons,
  recipe shapes, alpha-2 code format, exact positional IDs and line counts for all 675 files.
- `pnpm --filter=@flavor-db/world-dishes run review:coverage`: independently checks all baseline
  IDs and global order against Git commit `9333faf`, including missing and duplicate dishes.
- `pnpm --filter=@flavor-db/world-dishes run review:audit-coverage`: verifies all 8,160
  original-input target IDs appear in the fresh audit ledgers.
- `review/batch-ids.json`: persisted actual dish IDs by batch position. The build uses these
  positions and accepts only the documented repeated HowToCook suffix and r-225 `-1` mistakes.
- Every kept dish's imported recipe has exactly one status with its exact source URL; all country
  override codes were additionally checked against ISO 3166-1 alpha-2.
- The shared review application rejects every output dish with an empty country list, including
  unreviewed dishes. Validation runs after removals and last-recipe drops, and the receipt no-op
  path also validates existing output. Tests cover these cases; a dataset integrity test also
  requires every checked-in dish to have a country.
- `pending-batches.txt` and `pending-batches.tgz` are historical input artifacts, not remaining work.
  Unpack both archives into ignored `batches/` to inspect all 675 original inputs.

The 297 earlier batches supplied in `original-batches.tgz` have now been extracted alongside the
378 batches in `pending-batches.tgz`. Every removal, country override and name override in those
297 batches received a fresh second opinion against its actual original entry, including the
supplied raw excerpts. The `audits/original-*.md` ledgers record each targeted dish and outcome;
`check-original-audits.mts` checks target-ID coverage against the pre-follow-up verdict snapshot
`8476ba3`. The pass covered 8,160 targeted or subsequently changed records, corrected 540
verdict lines, restored 60 mistaken removals and newly removed 35 items. All 675 original batch
counts and boundaries now match the positional manifest.

Leaf Masala retains ZA because the source identifies Cape Malay cuisine. The modern HowToCook
Italian-sausage shakshuka adaptation receives CN under the generic home-version rule: Italian
sausage does not establish Italian provenance, and its North African title does not justify
assigning this particular adaptation to every country associated with traditional shakshuka.
Falafel retains inclusive Egyptian and Levantine associations; it is not assigned IN.

A structural recipe audit found 29 missing recipe statuses and one mistyped source URL. The gaps
were closed by reading the available original Tarator/Raffaello input and 27 recovered live raw
pages. These live pages are explicitly distinguished from original snapshots in the verdict reasons
and supplemental audit. `recovered-recipe-sources.tgz` preserves the live supplemental inputs.
Missing rationale fields on already authored metadata decisions were filled with manual-audit
provenance; this did not change any verdict, name, country, or recipe decision.

## Follow-ups

- Two country assignments are explicitly provisional and retained with user approval: African
  Cabbage Stew (`r-460`, position 1) has KE and ZA; African Beef Skewers (`r-472`, position 17) has
  SN and CI. Their sources identify Africa without supporting these individual countries, as the
  independent readers recorded. Stronger country-specific provenance remains a follow-up.
- Pages containing several recipes still generally include only the recipe imported originally:
  brigadeiro, Castagnaccio, Bacalhau à Brás, Sárgatúró, dashi and others. Importing the additional
  recipes is separate work.
- Original raw excerpts were cut at 6,000 characters. Long pages were only partly checked;
  corresponding extraction beyond the supplied excerpt remains unverified where explicitly noted.

## Final checks

Final country follow-up checks:

- `pnpm test`: 123 tests passed across nine files.
- `pnpm run lint`: passed (warnings remain).
- `pnpm run format`: passed.
- `pnpm --filter=website run build`: passed after merging main and applying the data.
- All five review checkers pass. A second `review:apply` run confirms an exact no-op with unchanged counts.
