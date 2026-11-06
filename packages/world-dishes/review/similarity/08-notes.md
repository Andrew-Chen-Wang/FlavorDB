# Batch 08 reader evidence and proposed vocabulary

All 30 assigned dishes and every supplied recipe were read. 29 profiles output, 1 blocked below. No duplicate of a supplied curated dish/existing WorldLink identified. Names/countries copied; only Chinese dishes with supplied Chinese names receive localName, since translated Chinese names are not native local names for Japanese/European dishes.

The input ranking measures source completeness, not observed page views. Flavor numbers are culinary estimates of ordinary prepared dishes, not measurements. Variant caveats below are intentional.

## Proposed graph entries (parent review required)

Form roots: `steamed: []`, `grilled: []`.
Form leaves:

- `steamed-pieces: [steamed]` — plain covered-steamed shellfish/pieces; shrimp source is steam/wine, not stir-fry.
- `grilled-skewers: [grilled]` — grilled skewered pieces.
- `baked-batter-pudding: [baked, bread-based]` — Yorkshire pudding, steam-raised batter in hot fat.
- `savory-tart: [baked]` — avoids sweets parent of existing tart.
- `cold-creamy-soup: [soup, cold-dish]` — raw blended/emulsified chilled soup; no dairy implication.
- `spoon-dessert: [sweets]` — thick cooled almond/egg cream/paste, not solid confection.
- `chunky-soup: [soup]` — grain/meat/vegetables in broth, neither clear soup nor thick stew.
- `custard-sauce: [sweets]` — pouring egg/dairy custard.
- `fried-dough: [bread-based, fried-crisp, sweets]` — doughnuts.
- `laminated-pastry: [bread-based, baked, sweets]` — unfilled butter/sugar laminated yeast pastry.
- `spit-cake: [bread-based, grilled, sweets]` — dough spiraled on a rotating cylinder.
- `folded-flatbread: [bread-based, griddled]` — stretched dough folded/layered then griddled.
- `open-sandwich: [bread-based]` — rubbed/topped bread without a second slice, not baked pizza.
- `raw-relish: [cold-dish]` — chopped raw vegetable condiment.
- `pie-in-soup: [bread-based, soup]` — intact savory pastry pie served in soup.
- `cold-terrine: [cold-dish]` — cooked meat chunks set in aspic, not necessarily sliced.
- `poached-pieces-in-broth: [soup, in-sauce]` — thin meat poached in seasoned broth; distinguish from stir-fried or braised chunks.

Base graph: `nuts: []`, `almond: [nuts]`. Almond is the principal substance of ajoblanco and bienmesabe; it should not be forced into grain/beans/fruit.

Steps: `blend` (raw soup emulsification/pureeing), `proof` (yeast-dough rising), `flambe` (crepe's liqueur finish), `poach` (gentle cooking of thin meat, distinct from braising), `hot-oil-finish` (aromatics/chile scalded with hot oil after plating).
Notes: `almond`, `olive-oil`, `vanilla`, `milk`, `caramel`, `paprika`, `caraway`, `wine`. These identify actual characteristic flavors; rice-wine is not a valid substitute for grape wine, cumin is not caraway, and dairy cream is not raw olive-oil emulsion.

## Blocked profile

- **Q1639621 — Kugel**: Supplied identity merges savory grated-potato/matzo/egg casserole (Polish) and sweet fruit-filled noodle-dough crown with cream (French; also has likely erroneous 500 cl quantity). Both are genuine kugel variants, but a single base/taste/process profile would collapse materially different foods. No profile emitted; recommend variant-specific profiles/links or explicit policy choice after parent review. This is not a curated duplicate.

## Per-dish evidence and uncertainty

- **Q7995577 — White boiled shrimp**: Fresh shrimp gently cooked covered over ginger/onion with rice wine, served with a separate soy/garlic/vinegar dip. The ordinary dish is quick-blanched shrimp, while this supplied method specifically steams in wine: use steam, not stir-fry. Dip intensity varies; conservative salt/sour. Evidence: https://github.com/Anduin2017/HowToCook/blob/master/dishes/aquatic/白灼虾/白灼虾.md

- **Q483163 — Yakitori**: Chicken thigh and scallion threaded onto skewers, grilled and repeatedly basted with soy/sake/mirin/sugar tare. Profiles the supplied tare version; salt-only yakitori is milder/simpler. No Japanese local name is supplied: Chinese translation omitted. Evidence: https://it.wikibooks.org/wiki/Libro_di_cucina%2FRicette%2FYakitori

- **Q951669 — Yorkshire pudding**: Egg/milk/flour batter rises in very hot fat and bakes until puffed and crisp. This is savory steam-leavened batter, neither sweet confection nor a chemically leavened quick bread. Herbs and mustard are optional and omitted from defining notes. Evidence: https://en.wikibooks.org/wiki/Cookbook%3AYorkshire_Pudding

- **Q11172960 — Yuxiangrousi**: Velveted shredded pork stir-fried with vegetables and doubanjiang, finished briefly with sugar/vinegar starch sauce. Yuxiang does not imply fish: seafood note deliberately absent. No Sichuan pepper appears, so numbing0. Evidence: https://github.com/Anduin2017/HowToCook/blob/master/dishes/meat_dish/鱼香肉丝.md

- **Q273426 — Éclair**: Choux paste cooked in a pan, enriched with eggs and baked hollow; filled with cooked chocolate pastry cream, chocolate-glazed and chilled. Chocolate version supported by the French recipe; ordinary eclairs may use other fillings. Evidence: https://fr.wikibooks.org/wiki/Livre_de_cuisine%2FDesserts%2F%C3%89clair

- **Q7882068 — Quiche Lorraine**: All variants bake an egg/cream/bacon custard in a pastry shell. French recipe explicitly blind-bakes then fills/rebakes; smoked bacon gives restrained smoke. Cheese is present in several but not classical French variant, so not defining. Existing tart has a sweets parent, hence new savory-tart. Evidence: https://en.wikibooks.org/wiki/Cookbook%3AQuiche_Lorraine; https://fr.wikibooks.org/wiki/Livre_de_cuisine%2FQuiche_lorraine; https://it.wikibooks.org/wiki/Libro_di_cucina%2FRicette%2FQuiche_Lorraine; https://pl.wikibooks.org/wiki/Ksi%C4%85%C5%BCka_kucharska%2FQuiche_lorraine

- **Q1635129 — Salmorejo**: Raw tomatoes and bread blended/emulsified with olive oil and garlic, chilled, often topped with egg/ham. Vinegar appears in French/Italian but not Spanish recipe; sour2 reflects tomatoes and variable vinegar. Creaminess comes from bread/oil, not dairy. Evidence: https://fr.wikibooks.org/wiki/Livre_de_cuisine%2FSalmorejo; https://es.wikibooks.org/wiki/Artes_culinarias%2FRecetas%2FSalmorejo; https://it.wikibooks.org/wiki/Libro_di_cucina%2FRicette%2FSalmorejo

- **Q413126 — Ajoblanco**: Alfarnate recipe supports almond/garlic/fava flour emulsion diluted and served cold with bread and fruit. Other source is an Extremaduran tomato/egg/bread version explicitly calling itself gazpacho; profile ordinary almond ajoblanco, not an invented blend of both recipes. Strong variant uncertainty flagged for parent. Evidence: https://es.wikibooks.org/wiki/Artes_culinarias%2FRecetas%2FAjoblanco; https://es.wikibooks.org/wiki/Artes_culinarias%2FRecetas%2FPlatos_t%C3%ADpicos_de_Alfarnate%2FAjo_blanco

- **Q5728279 — Bienmesabe**: Both recipes make a dense almond/sugar syrup paste enriched with egg yolks and cinnamon, cooled for small servings. Spanish version adds lemon; omit as nonuniversal. Profiles Spanish almond bienmesabe, not Venezuelan coconut cake despite merged country coverage. Evidence: https://fr.wikibooks.org/wiki/Livre_de_cuisine%2FBienmesabe; https://es.wikibooks.org/wiki/Artes_culinarias%2FRecetas%2FBienmesabe

- **Q888832 — Bobotie**: Spiced minced beef/lamb with milk-soaked bread, raisins/chutney, acid; baked under egg/milk custard. Beef selected as shared primary across two recipes. Curry warmth is mild rather than fiery; fruit and tang are distinctive. Evidence: https://en.wikibooks.org/wiki/Cookbook%3ABobotie; https://pl.wikibooks.org/wiki/Ksi%C4%85%C5%BCka_kucharska%2FBobotie

- **Q12219245 — Chorba frik**: Cracked green wheat and beef/lamb simmered with celery/herbs/tomato, served with lemon. Soupy with distinct grain/meat solids rather than clear broth or pureed soup. Generic meat preserves beef/lamb alternatives; no unsupported cumin. Freekeh may be smoky but source does not establish roast intensity, so smoke0. Evidence: https://fr.wikibooks.org/wiki/Livre_de_cuisine%2FChorba_frik; https://fr.wikibooks.org/wiki/Livre_de_cuisine%2FChorba_frik2

- **Q868158 — Cocido**: Chickpeas and mixed meats/vegetables simmered until tender; Italian variant separates broth/pasta course from drained beans/meat. Uses generic meat to cover chicken-only Spanish and beef/pork/chicken Italian versions. Rich mixed-meat ordinary cocido modeled; no chili heat inferred from chorizo alone. Evidence: https://es.wikibooks.org/wiki/Artes_culinarias%2FRecetas%2FCocido; https://it.wikibooks.org/wiki/Libro_di_cucina%2FRicette%2FCocido

- **Q738 — Croque-monsieur**: Ham/cheese bread toasted under grill or sandwich press, béchamel in English version. Base remains bread+cheese, not pasta. Grilling follows assembly; optional croque-madame egg excluded. Thickening is English béchamel variant and may be omitted in press version. Evidence: https://en.wikibooks.org/wiki/Cookbook%3ACroque_Monsieur; https://fr.wikibooks.org/wiki/Livre_de_cuisine%2FCroque-monsieur

- **Q1342574 — Crème anglaise**: Milk, sugar and egg yolks gently heated below boiling until coating a spoon, cooled; both sources specify vanilla. Pouring sauce needs distinct form, not baked custard or solid confection. No cream ingredient: use milk note. Evidence: https://en.wikibooks.org/wiki/Cookbook%3ACr%C3%A8me_Anglaise; https://fr.wikibooks.org/wiki/Livre_de_cuisine%2FCr%C3%A8me_anglaise

- **Q1142539 — Crêpe Suzette**: Premade crepes soaked/turned in buttery orange/lemon sugar sauce, folded and flambéed with orange liqueur. Dutch source explicitly caramelizes sugar; French starts with butter/sugar/juice. Existing crepe form appropriate; flambe is a defining missing step. Smoke is not implied by flame. Evidence: https://fr.wikibooks.org/wiki/Livre_de_cuisine%2FCr%C3%AApe_Suzette; https://nl.wikibooks.org/wiki/Kookboek%2FCr%C3%AApe_Suzette

- **Q995376 — Fabada asturiana**: White fabes long-simmered with cured pork, chorizo and blood sausage into rich bean stew; French adds garlic/saffron. Chorizo fort gives mild-to-moderate warmth; ordinary fabada not fiery. Slight smoky cured-meat character, not a smoked cooking technique. Evidence: https://fr.wikibooks.org/wiki/Livre_de_cuisine%2FFabada_asturiana; https://es.wikibooks.org/wiki/Artes_culinarias%2FRecetas%2FFabada_asturiana

- **Q5511397 — Fánk**: Both Hungarian recipes raise soft enriched yeast dough, cut discs, fry, sugar-coat; rum in dough and variable jam/chocolate/pudding toppings. Base dough profile avoids choosing optional filling as identity; two robust notes bread/fried-crust. Butter only in second recipe. Evidence: https://hu.wikibooks.org/wiki/Szak%C3%A1csk%C3%B6nyv%2FZs%C3%ADrban_s%C3%BCltek%2FF%C3%A1nkok%2FF%C3%A1nk; https://hu.wikibooks.org/wiki/Szak%C3%A1csk%C3%B6nyv%2FZs%C3%ADrban_s%C3%BCltek%2FF%C3%A1nkok%2FF%C3%A1nk_2.

- **Q3503333 — Gulyásleves**: Beef/onion paprika base simmered with roots, then potatoes; soup deliberately loosened with water. Hungarian kömény is caraway, not cumin. Hot pepper optional, so spicy1, not chili-stew levels. No curated gulyas duplicate in supplied catalog. Evidence: https://hu.wikibooks.org/wiki/Szak%C3%A1csk%C3%B6nyv%2FGuly%C3%A1slevesek%2FGuly%C3%A1s_leves; https://hu.wikibooks.org/wiki/Szak%C3%A1csk%C3%B6nyv%2FGuly%C3%A1slevesek%2FGuly%C3%A1sleves

- **Q548319 — Kouign-amann**: Both recipes fold salted butter/sugar into yeast dough and bake; Italian explicitly proves twice. Lamination and caramelized sugar crust distinguish it from filled pastry or quick bread. Butter/sugar ratios vary, but intensely buttery/sweet ordinary identity remains. Evidence: https://fr.wikibooks.org/wiki/Livre_de_cuisine%2FKouign_amann; https://it.wikibooks.org/wiki/Libro_di_cucina%2FRicette%2FKouign_amann

- **Q1688949 — Kürtőskalács**: Yeast dough strips spiraled around buttered cylinder, rotated over coals/grill, basted and sugared. Butter/sugar crust defines; nuts/cinnamon/vanilla optional and not silently selected. Light smoke allowed from explicit embers, not strong smoked flavor. Evidence: https://it.wikibooks.org/wiki/Libro_di_cucina%2FRicette%2FK%C3%BCrt%C5%91skal%C3%A1cs; https://hu.wikibooks.org/wiki/Szak%C3%A1csk%C3%B6nyv%2FZs%C3%ADrban_s%C3%BCltek%2FF%C3%A1nkok%2FK%C3%BCrt%C5%91skal%C3%A1cs

- **Q2631911 — Msemmen**: Semolina/wheat dough stretched thin, oiled/buttered and folded into squares, griddled. Not crepe: dough layers rather than poured batter. Plain form profiled; honey/jam and savory fillings are accompaniments/variants. English yeast not shared by French recipe, so no proof step. Evidence: https://en.wikibooks.org/wiki/Cookbook%3AMsemmen; https://fr.wikibooks.org/wiki/Livre_de_cuisine%2FMsemmen

- **Q1411695 — Pa amb tomàquet**: Bread rubbed with ripe tomato/garlic and olive oil, optional ham; Polish source toasts, French does not. Profile common rubbed bread rather than forcing baking or meat as essential. Open sandwich leaf avoids implying pizza/flatbread baking. Evidence: https://fr.wikibooks.org/wiki/Livre_de_cuisine%2FPa_amb_tom%C3%A0quet; https://pl.wikibooks.org/wiki/Ksi%C4%85%C5%BCka_kucharska%2FPa_amb_tom%C3%A0quet

- **Q1126275 — Pakora**: Vegetables coated in pulse-flour batter and fried: onion/chickpea/nigella French, cauliflower/yellow-pea/hing/chili/cinnamon Hungarian. Ordinary fried pakora form modeled with deep-fry, though French uses a shallow pan. Mild heat supported, no garlic invented. Evidence: https://fr.wikibooks.org/wiki/Livre_de_cuisine%2FPakora; https://hu.wikibooks.org/wiki/Szak%C3%A1csk%C3%B6nyv%2FVeget%C3%A1ri%C3%A1nus%2FDesszert%2FPakora

- **Q2457586 — Patatas bravas**: Ordinary bravas are crisp potato pieces with spicy sauce; Dutch source parboils/fries and tops with tomato/Tabasco/mustard. Polish instead roasts wedges with garlic and offers romesco/aioli: notable method variation, not blended into steps. Garlic from Polish, heat/tomato from Dutch. Evidence: https://pl.wikibooks.org/wiki/Ksi%C4%85%C5%BCka_kucharska%2FPatatas_bravas; https://nl.wikibooks.org/wiki/Kookboek%2FPatatas_bravas

- **Q3772863 — Pebre**: Chopped raw tomato/onion/cilantro/parsley/chili mixed as Chilean condiment. German variant adds tomato paste/oil and optional garlic. No vinegar or citrus in either source: sour1 from tomato only. Heat variable with chile amount; moderate3. Evidence: https://de.wikibooks.org/wiki/Kochbuch%2F_Pebre; https://es.wikibooks.org/wiki/Artes_culinarias%2FRecetas%2FPebre

- **Q177564 — Pico de gallo**: Raw diced tomato/onion/cilantro/jalapeno salsa with lime/lemon; Spanish version adds orange and chills two hours. Fresh tang and moderate jalapeno heat, very low richness. Distinct from curated dish catalog and existing links. Evidence: https://en.wikibooks.org/wiki/Cookbook%3APico_de_Gallo; https://es.wikibooks.org/wiki/Artes_culinarias%2FRecetas%2FPico_de_gallo

- **Q7191338 — Pie floater**: English source establishes meat pie heated crisp and inverted in pea soup. Polish recipe only cooks/blends pea soup, omitting the pie: profile full English identity and flag incomplete source. Pastry+peas most characteristic combined structure; meat type unspecified. Pepper is supported by Polish soup. Evidence: https://en.wikibooks.org/wiki/Cookbook%3APie_Floater; https://pl.wikibooks.org/wiki/Ksi%C4%85%C5%BCka_kucharska%2FPie_floater

- **Q966824 — Potjevleesch**: Chicken/rabbit/veal/pork layered in terrine, simmered 3–4 hours with herbs and wine or vinegar, chilled to set natural/added jelly. Meat chunks in aspic, not roast slices. Vinegar/wine alternatives yield variable sourness; use moderate3 for traditional tang, wine note may vary by recipe. Evidence: https://fr.wikibooks.org/wiki/Livre_de_cuisine%2FPotjevleesch; https://fr.wikibooks.org/wiki/Livre_de_cuisine%2FPotjevleesch2

- **Q115616093 — Shuizhu roupian**: HowToCook explicitly velvets thin pork, poaches in doubanjiang broth over vegetables, tops with knife-chopped chile/pepper/garlic, and pours 200g hot rapeseed oil. Japanese variant stir-fries pork first, but defining ordinary identity follows Chinese poach/oil method. Strong heat/numbing directly supported; heavy oil richness5, no smoke. Evidence: https://github.com/Anduin2017/HowToCook/blob/master/dishes/meat_dish/水煮肉片.md; https://ja.wikibooks.org/wiki/%E6%96%99%E7%90%86%E6%9C%AC%2F%E6%B0%B4%E7%85%AE%E8%82%89%E7%89%87
