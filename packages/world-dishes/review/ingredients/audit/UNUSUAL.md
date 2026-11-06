# Unusual ingredient decisions

All 233 detailed audit notes were read. These 32 representative entries are retained for user decisions; nothing was removed. Exact source strings and recorded IDs are preserved below.

[Complete audit notes](notes.jsonl) include the remaining examples and mapping context. Catalog data was also checked in [ingredients-world.ts](../../../../seed-data/src/ingredients-world.ts) and [ingredients-world-additions.ts](../../../../seed-data/src/ingredients-world-additions.ts).

## Source ambiguities and historical flavorings

| Recorded IDs              | Exact source string (audit; language)                                                                           | Decision context                                                                                                     |
| ------------------------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| cannabis                  | “1 cup finely-ground pure cannabis” (172; en)                                                                   | Explicitly named; user decision on catalog coverage.                                                                 |
| tobacco                   | “1 dash of tobacco (optional)” (202; en)                                                                        | Sweet Beef source may contain a typo for Tabasco. Keep the literal mapping pending source/user decision.             |
| ambergris; musk           | “1 grain ambergris (no modern substitute)” (213; en); “1 grain musk (substitute edible musk essence)” (214; en) | Historical flavorings; musk source also offers an essence substitute.                                                |
| placenta                  | “Placenta” (2855; labels)                                                                                       | Bare label could denote organ tissue or the historical pastry; source clarification needed.                          |
| [] (proposed animal-glue) | “1 dkg enyv,” (1506; hu)                                                                                        | No mapping added. animal-glue is only a proposed ID and is absent from the catalog; Ajz source names dissolved glue. |

## Insects and other small invertebrates

| Recorded IDs           | Exact source string (audit; language)                                                        | Decision context                                                                                         |
| ---------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| flying-ants            | “1 cup fresh or dried flying ants” (176; en)                                                 | Flying ants.                                                                                             |
| mopane-worms           | “1 cup fresh or dried mopane worms” (177; en)                                                | Mopane worms.                                                                                            |
| cockchafer; may-beetle | “chrabąszcze majowe” (3466; pl; cockchafer); “chrabąszcze majowe” (2438; labels; may-beetle) | Cockchafer / May beetles; both exact IDs currently exist. Same Polish string was recorded under two IDs. |
| ant-eggs               | “ant eggs” (2279; labels)                                                                    | Ant eggs.                                                                                                |
| ragworm                | “Nereididae” (2773; labels)                                                                  | Ragworm.                                                                                                 |

## Animal species and products

| Recorded IDs       | Exact source string (audit; language)                | Decision context                                                        |
| ------------------ | ---------------------------------------------------- | ----------------------------------------------------------------------- |
| cat-meat; dog-meat | “cat meat” (2411; labels); “dog meat” (2503; labels) | Cat and dog meat.                                                       |
| bat                | “bat” (2325; labels)                                 | Bat meat.                                                               |
| ortolan            | “Ortolan Bunting” (2790; labels)                     | Ortolan bunting.                                                        |
| tiger-penis        | “tiger penis” (3055; labels)                         | Tiger animal product.                                                   |
| shark-fin          | “400 g shark fins” (701; en)                         | Shark fins.                                                             |
| whale              | “whale meat” (3113; labels)                          | Ledger separately records minke-whale and harp-seal.                    |
| pufferfish         | “河豚﹝危險，有喪命之虞﹞” (3788; zh)                | Source text includes its own parenthetical caution.                     |
| bushmeat           | “Viande de brousse de votre choix” (1470; fr)        | Broad category; animal species unspecified.                             |
| iguana             | “1 medium iguana” (245; en)                          | Iguana.                                                                 |
| lamb-blood         | “½ kg de sangre de cordero cocida” (1256; es)        | Cooked lamb blood; ledger also includes other animal blood ingredients. |
| milt, fish-roe     | “fél kg haltej, halikra, vegyesen,” (1927; hu)       | Fish milt alongside roe.                                                |

## Botanicals and concentrated floral flavorings

| Recorded IDs  | Exact source string (audit; language)                                  | Decision context                                           |
| ------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------- |
| orchid-tubers | “1 cup dried and ground wild orchid tubers (chikanda roots)” (167; en) | Wild orchid tubers; ledger also records salep.             |
| neroli        | “4 cuillères à soupe de néroli” (1389; fr)                             | Four tablespoons merits source/quantity clarification.     |
| nanoukou      | “poudre de nanoukou” (1450; fr)                                        | Local ingredient name needs a clearer catalog description. |

## Decorations, processing ingredients and cooking materials

| Recorded IDs            | Exact source string (audit; language)                                                                                                                             | Decision context                                                                          |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| gold-leaf               | “Blattgold (optional)” (85; de)                                                                                                                                   | Ledger also includes silver leaf and edible glitter.                                      |
| slaked-lime             | “1/2 taza de cal” (1109; es)                                                                                                                                      | Slaked lime.                                                                              |
| quicklime               | “Cal virgem (para cada 24 pedaços de abóbora, usar uma colher (das de sopa) do produto (é usada para impedir que os pedaços se desmanchem na panela).” (3588; pt) | Explicitly used while preparing pumpkin.                                                  |
| epsom-salt              | “10 g de sal amargo (Sulfato de Magnésio) – vende na farmácia.” (3560; pt)                                                                                        | Epsom salt / magnesium sulfate.                                                           |
| saltpeter               | “5 g salétromsó” (1834; hu)                                                                                                                                       | Saltpeter.                                                                                |
| potassium-metabisulfite | “1 kávéskanál borkénpor,” (1554; hu)                                                                                                                              | Corrected from sulfur; distinct catalog ingredient exists in additions.                   |
| isinglass               | “25 gram vislijm” (3315; nl)                                                                                                                                      | Fish-derived processing/gelling ingredient.                                               |
| apple-wood              | “Several lbs apple wood” (939; en)                                                                                                                                | Cooking/smoking material; decide whether such materials belong in the ingredient catalog. |
