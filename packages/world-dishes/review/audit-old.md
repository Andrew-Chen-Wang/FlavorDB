# Existing verdict input recovery (in progress)

The supplied archive contains the 378 pending batch inputs. Original inputs for 297 previously
reviewed verdict files are absent. No tracked batch inputs or fetch cache were found in the
available Git history. The fetch cache is also absent from this checkout.

## Recovered metadata

`batches/recovered/NAME.md` contains metadata for those 297 files, reconstructed mechanically from
the checked-in `data/dishes-*.jsonl`: 23,103 dishes. These local files are ignored with `batches/`.
Their entries follow verdict order. They are explicitly marked as reconstructed and **do not prove
the original batch order or completeness**. They must not be passed to the checker as original inputs.

Every verdict ID resolves to a checked-in dish, accepting only the documented variants: 14 HowToCook
IDs with a repeated final name suffix and r-225's `wikibooks-hu:libatepertő-1`. All remaining IDs match
exactly. This verifies metadata lookup, not the correctness of any judgment.

The reconstructed entries include names, descriptions, current countries, cuisines, kinds,
ingredients, Wikipedia links, and extracted recipes. Every recipe explicitly says its raw source is
unavailable. Metadata supports a second opinion on removals and countries, but cannot verify recipe
extraction fidelity. Recovering the original raw pages requires the original fetch cache or fetching
the linked sources again; newly fetched pages might have changed since import.

Before the second opinion, the absent-input verdict files contained 1,166 remove verdicts and 7,080
country overrides. These are the starting audit counts, not completed audit totals.

## Known-error locations

- Tırşik çorbası: Q6083159, `data/dishes-06.jsonl:858`, `verdicts/names-049.jsonl:76`.
  Reversed the erroneous removal as directed by the user; the original reason mistook the poisonous
  plant description for evidence that the prepared soup was not a dish.
- Errötendes Mädchen: Q48754335, `data/dishes-05.jsonl:1651`, `verdicts/names-043.jsonl:291`.
  Reversed the erroneous removal as directed by the user; the original reason identified an artwork.
- Falafel: Q188788, `data/dishes-03.jsonl:2317`, `verdicts/r-032.jsonl:10`. Neither the checked-in dish
  nor that verdict contains an IN country assignment. The original verdict in commit 9333faf also has
  no country override. Five current dish names contain “falafel”: Falafel, Falafel burger, Kichererbsen
  Falafel Bratwurst, Falafel Salad, and Falafel Seitan Bratwurst. All five have empty data countries;
  the existing verdicts for the first three have no country override, and the remaining two had no
  verdict at inspection time. No country correction was inferred from cookbook language.

## Independent order evidence

The 17,530 checked-in dishes without recipes are in the order used by the supplied name batches:
300-entry slices reproduce both available `names-025` and `names-036` input ID lists exactly.
This is supporting evidence for rebuilding name metadata independently from data order. It does not
recover original recipe raw sources, and the recovered files above intentionally retain their
explicitly disclosed verdict-based ordering.
