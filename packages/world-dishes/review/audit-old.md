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

All 59 name verdict files were subsequently compared to independent 300-entry slices of the
17,530 recipe-free data records. Fifty-eight matched exactly. `names-048` contained the same IDs but
had positions 100–103 rotated; those four unchanged verdicts were restored to data order. The local
`batches/recovered-names/` directory contains all 59 metadata inputs in this independent data order,
with explicit reconstruction labels. The original archive batches remain untouched.

Recipe batch sizes vary with source text length (for example r-055 has 19 entries, r-212 has 23,
and r-215 has 35, each around 69–77 KB). The available build-batches script describes an older
60-entry scheme and cannot reproduce those boundaries. Without the raw cache, original recipe
batch boundaries and source text cannot be independently reconstructed.

## Second-opinion progress

Reread every remove verdict and country override against the complete recovered metadata entry in
`names-000` through `names-004`: 904 targeted entries. This is metadata review; no absent raw source
is claimed to have been read. Remaining files are still pending second opinion.

Corrections include restoring Gukbap, Korean hot bar, Jeotgal, and Akidi as prepared foods; removing
the branded Kexchoklad product and five Bengali fruit/tea drinks previously retained as dishes;
correcting Carnixulla to Spain, Monteiro Lopes to Brazil, Kola kanda to Sri Lanka, and French burnt
peanuts to the United States; adding Moldova for Zeama, Spain for Tiborna, and Belgium for
Suikerboon; and clearing unsupported national assignments on white cake and raw vegetable salad.

Supporting sources consulted for these corrections:

- [Menorca merchants: carn-i-xulla](https://www.comerciomenorca.es/comercio/381/carnisseria-siscu-pons/)
- [Monteiro Lopes](https://pt.wikipedia.org/wiki/Monteiro_Lopes)
- [Moldova business welcome pack: Zeama](https://mbw.md/wp-content/uploads/2024/09/Copie-a-Welcome-Pack-v2.pdf-1_compressed.pdf)
- [Korea Tourism Organization: Gukbap](https://stg-russian.visitkorea.or.kr/svc/contents/contentsView.do?vcontsId=178144)
- [Kola kanda population study](https://www.ijaar.in/index.php/journal/article/view/973)
- [Cloetta brands](https://www.cloetta.com/en/about-cloetta/markets-and-brands/cloettas-brands/)
- [Saptapadi: Bengali drinks](https://www.saptapadirestaurant.com/catering-services)
- [Hot bar: Korean street food](https://www.lonelyplanet.com/articles/best-street-food-south-korea)
- [Akidi prepared dish](https://commons.wikimedia.org/wiki/File%3AAkidi.jpg)
- [French burnt peanuts producer explanation](https://www.lorentanuts.com/blog/french-burnt-peanuts-explained/)
- [Suikerboon](https://en.wikipedia.org/wiki/Suikerboon)

Reread all targeted entries in `names-005` through `names-009` as well: respectively 202, 275,
178, 105, and 119 entries, bringing this worker's completed metadata audit to 1,783 entries
across `names-000`–`names-009`. Restored chowder, shrimp pizza, and the appetizer item “Cocktail”
(the image is shrimp cocktail); removed Gondhoraj ghol as a drink. Corrected further country
mistakes including the Udmurt turnip pie, Corsican panzarotti, Italian diplomatica, Taiwanese
Yilan specialties, Japanese anzu ame, American beaded ice cream, and melon with ham. Retained
multiple common associations for balti, croffle, porchetta, ropa vieja, honey walnut shrimp, and
spicy duck blood. Cleared unsupported countries on generic ice creams, plum puree, and the
individually examined generic potato preparations whose old reasons relied on Polish cookbook
language. Original recipe raw sources remain unavailable for these reconstructed inputs.

Additional supporting sources:

- [Udmurt turnip pie](https://nazaccent.ru/kitchen/recipe/89/)
- [Austrian ministry: dumplings](https://www.bmluk.gv.at/themen/lebensmittel/trad-lebensmittel/speisen/knoedel_allgemein.html)
- [Balti association history](https://apab.org.uk/balti-history/)
- [Gondhoraj ghol recipe](https://www.firsttimercook.com/gondhoraj-ghol-a-fragrant-bengali-buttermilk/)
- [Corsica tourism: panzarotti](https://www.visit-corsica.com/fr/La-destination-Corse/Gastronomie-et-saveurs/Recettes-corses/I-Panzarotti)
- [Taiwan immigration agency: Yilan pork](https://nit.immigration.gov.tw/Multicultural/Detail/7b519ba0-8aaf-4c9c-86e9-bc6e4fa87bf4)
- [Jiaoxi tourism: eight-treasure glass noodles](https://jiaoxi-tourism.tw/index.php/zh/2022-01-12-07-29-13/2022-01-12-07-13-20/2022-01-12-07-13-22/item/298-shop-e-9)
- [Italian pastry producer: diplomatica](https://www.saporiepiaceri.it/prodotto/diplomatica/)
- [Shrimp cocktail image description](https://commons.wikimedia.org/wiki/File:Cocktail_1_bg_060702.jpg)
- [Croffle history](https://en.wikipedia.org/wiki/Croffle)
- [Dippin' Dots company history](https://www.dippindots.com/about/company-history/)
- [New Taipei tourism: fish crisps](https://newtaipei.travel/zh-tw/shop/detail/207149)
- [Taiwan education ministry: fish crisps](https://sutian.moe.edu.tw/zh-hant/su/14303/)
- [Honey walnut shrimp](https://blog.resy.com/2020/08/the-chinese-american-dish-that-isnt-really/)
- [Anzu ame confectionery supplier](https://d-kokuya.shop-pro.jp/?mode=f5)
