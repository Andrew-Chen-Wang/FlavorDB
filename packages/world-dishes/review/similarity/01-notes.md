# Batch01 manual profile review

Read all30 exact dish records and every supplied recipe, names/description/countries, plus vocabulary, curated names and existing world links. No curated identity duplicates or existing-link duplicates found. No skips. No external browsing used; all judgments grounded in supplied context. Taste numbers are approximate reader estimates of representative plated versions, not measured data. Countries copied unchanged. localName omitted: supplied aliases are Chinese translations of dishes from other languages, not supported original local scripts.

## Proposed vocabulary (parent review required)

Forms: wrapped-flatbread → [wrapped,bread-based]; sushi-roll → [rice-dish,wrapped,cold-dish]; sauce → [cold-dish]; fried-dough → [fried-crisp,sweets]; egg-dipped-bread → [bread-based,griddled]; small-cake → [baked,sweets]; grilled (new group) → []; grilled-minced-meat → [grilled]; topped-chips → [baked,fried-crisp]; rice-ball → [rice-dish]; meringue-dessert → [baked,sweets]; small-pancakes → [griddled,sweets]; snack (new group) → []; puffed-snack → [snack]; boiled-meat-and-vegetables → [soup]; fried-cutlet → [fried-crisp]; cold-creamy-soup → [soup,cold-dish]; biscuit → [baked,sweets]. No existing leaf is made a parent by these proposals.
Bases: flour-tortilla → [bread]; herbs → [vegetable]; oil → []; mushroom → [vegetable] (culinary vegetable category); buckwheat → [grain]; coconut → [fruit]. oil is shared as base for herb oil sauce and mayonnaise dressing; egg is its second base for mayonnaise identity.
Steps: shape (mold, pipe, extrude), make-mixture (combine ground meat), proof (yeast batter rise), whip (aerate egg whites), blend (purée soup/dressing), pop (expand kernels under dry/pan heat). Add user-facing labels for these transformations.
Notes: shallot,seaweed,olive-oil,wheat,onion,vanilla,caraway,mushroom,buckwheat,coconut,galangal,leek,anise. Each is a flavor explicitly present in recipes; caraway is Hungarian kömény, not cumin. No new parent hierarchy needed for notes.

## Per-dish evidence and uncertainty

### Q390823 — Burrito

Both recipes heat wheat tortillas, prepare beans/meat/rice, then completely fold and enclose fillings. Beans are the stable representative filling; recipes explicitly allow many alternatives. Moderate chili/cumin/garlic, not every optional topping. High uncertainty in filling-dependent taste; no seafood or cheese presumed universal.
Evidence: packages/world-dishes/data/dishes-05.jsonl:295 (sha256 e3f5f345112cfe40d7e95afa462c5a7aa65925b782f2a5a70a99b3815635c549); recipes https://en.wikibooks.org/wiki/Cookbook%3ABurrito; https://nl.wikibooks.org/wiki/Kookboek%2FBurrito.

### Q564567 — Bánh chưng

English rice/bean/pork parcel is double leaf-wrapped and submerged for6–8h; French version uses foil and5h boiling. Profile ordinary leaf-wrapped identity, glutinous rice dominant, pork second; beans excluded only by two-base limit. Shallot and pepper from English, French simpler. Boiling package rather than steaming is explicit.
Evidence: packages/world-dishes/data/dishes-05.jsonl:2010 (sha256 97fac39d5b3e92256dff2bc7e87d1733c23b19ed12cc5bc305a57a5d69d36ba8); recipes https://en.wikibooks.org/wiki/Cookbook%3AB%C3%A1nh_Ch%C6%B0ng; https://fr.wikibooks.org/wiki/Livre_de_cuisine%2FB%C3%A1nh_ch%C6%B0ng.

### Q1139527 — California roll

Both make inside-out rice/nori/crabstick rolls, coat with sesame and slice. Dutch recipe seasons rice with vinegar/mirin and uses avocado; Portuguese uses mango and lettuce. Mild sweet-sour rice, sesame, seafood; optional wasabi omitted from baseline heat. Shellfish represents crab/surimi identity; actual surimi is fish, a material variant.
Evidence: packages/world-dishes/data/dishes-01.jsonl:1182 (sha256 612eb648be457e72cdec24022635de6b70288d506dffa7c15924634eee26d670); recipes https://pt.wikibooks.org/wiki/Livro_de_receitas%2FCalifornia_Roll; https://nl.wikibooks.org/wiki/Kookboek%2FCalifornia_Roll.

### Q1815560 — Calzone

Two folded half-moon pizza-dough pockets baked at200C with mozzarella/other cheese and oregano. English dough bought ready, French made and risen. Tomato belongs French filling and English marinara accompaniment. Optional meat/anchovy excluded from baseline.
Evidence: packages/world-dishes/data/dishes-03.jsonl:1624 (sha256 7e9fabafa96911d5f77f1ff2c554e217f0b23ecc9e43a91b999a360f16a25866); recipes https://en.wikibooks.org/wiki/Cookbook%3ACalzone; https://fr.wikibooks.org/wiki/Livre_de_cuisine%2FCalzone.

### Q20010 — Cannelloni

Both recipes boil pasta sheets, fill/roll and bake under cheese/sauce. French meat/brocciu filling and Italian mixed-meat filling differ; base is pasta alone per noodle rule. Butter, cheese and tomato are shared central flavors; garlic not forced from only French.
Evidence: packages/world-dishes/data/dishes-03.jsonl:2094 (sha256 91229cc130cd4be79dfae5ce021240a9892dfb87fbc6c62d118591b39ed3b972); recipes https://fr.wikibooks.org/wiki/Livre_de_cuisine%2FCannelloni; https://it.wikibooks.org/wiki/Libro_di_cucina%2FRicette%2FCannelloni.

### Q1073142 — Chimichurri

English/Dutch nearly matching chopped parsley/oregano/garlic/oil/vinegar sauces. Hot diluted vinegar softens aromatics, then oil mixed and overnight chilled. Not a cooked stew or vegetable salad. Chili is to taste, set moderate2; olive-oil and herbs carry flavor. Brief vinegar boil not a defining cooking transformation of the sauce.
Evidence: packages/world-dishes/data/dishes-00.jsonl:1665 (sha256 52a98bb292cdcb54f458da7a411e42eae323fea6b0a2d5a2222934865ce69fc0); recipes https://en.wikibooks.org/wiki/Cookbook%3AChimichurri; https://nl.wikibooks.org/wiki/Kookboek%2FChimichurri.

### Q727605 — Churro

French and Spanish use flour/hotwater dough piped directly into oil, fried golden and sugar-coated. Neither supplied recipe has cinnamon/vanilla/chocolate, so none inferred. Shape captures piping, not yeast proofing; no eggs in these recipes.
Evidence: packages/world-dishes/data/dishes-06.jsonl:1294 (sha256 e75ed64311238d620aeb17a9c427218d71e92916ea61c17482d216004f6f2df3); recipes https://fr.wikibooks.org/wiki/Livre_de_cuisine%2FChurro; https://es.wikibooks.org/wiki/Artes_culinarias%2FRecetas%2FChurro.

### Q2981415 — Coddle

Both sausage/bacon/onion/potato pots simmer around1h; English potatoes disintegrate to thicken broth, French layers slices. No browning step. Strong salty pork/broth with onion; no smoke assumed merely from bacon.
Evidence: packages/world-dishes/data/dishes-04.jsonl:1500 (sha256 83d8b8deda346a6eb7fbfac9fe28487ff58b22a90c6d36c02e528062f7635e40); recipes https://en.wikibooks.org/wiki/Cookbook%3ACoddle; https://fr.wikibooks.org/wiki/Livre_de_cuisine%2FCoddle.

### Q179158 — Cream of mushroom soup

English mushroom/onion butter roux, milk/stock simmer and puree; HowToCook similar flour-thickened milk/cream with optional blending. Creamy mushroom identity stable. Blend included typical English smooth version, uncertainty because Chinese leaves puree optional.
Evidence: packages/world-dishes/data/dishes-03.jsonl:1561 (sha256 da59c72a24f9cc5ac43e891a6616063682c14fe3852a09312b872dfb5c4a401d); recipes https://en.wikibooks.org/wiki/Cookbook%3ACream_of_Mushroom_Soup; https://github.com/Anduin2017/HowToCook/blob/master/dishes/soup/奶油蘑菇汤.md.

### Q197973 — French toast

English egg/milk-soaked bread browned in greased pan, spices/vanilla and sweet toppings; German recipe is ham-cheese stuffed savory sandwich. Ordinary sweet French-toast identity chosen explicitly rather than averaging incompatible variants. Sweetness3 is plated sweet version; toppings materially alter it. No ham/cheese baseline.
Evidence: packages/world-dishes/data/dishes-03.jsonl:2009 (sha256 a77b755db54e101742a80d330ec6a159855b7ea49c70ae0a22a3974efa356f4b); recipes https://en.wikibooks.org/wiki/Cookbook%3AFrench_Toast; https://de.wikibooks.org/wiki/Kochbuch%2F_French_Toast.

### Q604408 — Madeleine

French shell-mold butter/egg/flour batter chemically leavened and baked; Italian same proportions with optional orange-blossom aroma. No universal citrus note invented. Chilling optional, so not defining. Small molded cake requires form, not bread loaf or filled pastry.
Evidence: packages/world-dishes/data/dishes-05.jsonl:2473 (sha256 8922b6693ab46f2b919e33b01394211965c55385eb46f6f342ee93352b4b1116); recipes https://fr.wikibooks.org/wiki/Livre_de_cuisine%2FMadeleine; https://it.wikibooks.org/wiki/Libro_di_cucina%2FRicette%2FMadeleine.

### Q600438 — Mititei

Both Hungarian sources mince fatty beef with garlic, pepper, kömény(caraway), stock and bicarbonate, chill3–5h, mold skinless sausages, grill while basting. First acknowledges mixed pork/lamb variants; baseline beef is supported by both. Wikidata chili is not in either recipe; heat0. Char from grill, not smoke-cure.
Evidence: packages/world-dishes/data/dishes-05.jsonl:2395 (sha256 4e796cda73a02f33c6dea51018da95ed89aeac62649333d3f9f0a801b8337328); recipes https://hu.wikibooks.org/wiki/Szak%C3%A1csk%C3%B6nyv%2FH%C3%BAsok%2FVagdalth%C3%BAsok%2FMititei; https://hu.wikibooks.org/wiki/Szak%C3%A1csk%C3%B6nyv%2FH%C3%BAsok%2FVagdalth%C3%BAsok%2FMititei_2..

### Q466430 — Nachos

English cornchips covered with cheddar and optional greenchiles then baked to melt; Dutch loaded beans/meat/tomato/cheese version. Core cornchips+cheese dominant, modest chile baseline; no assumption every serving has meat/beans. Sour1 from customary source guacamole/sourcream variants, lower certainty.
Evidence: packages/world-dishes/data/dishes-05.jsonl:762 (sha256 7edbd27d82712b47cf1bfd0a5a95b0333bc2aae10193f2a8e13b222d5da59deb); recipes https://en.wikibooks.org/wiki/Cookbook%3ANachos; https://nl.wikibooks.org/wiki/Kookboek%2FNachos.

### Q510666 — Nasi goreng

Both cook rice and fry/toss with meat/veg and omelet strips; Dutch chills rice and fries in porkfat with trassi,sambal,kecapmanis. Rice-only base. Representative Indonesian sweet soy/chile/shrimp seasoning; Dutch bacon-heavy prep not generalized into base or smoke. Smoky0: no smoke or charring is explicitly supported; frying alone does not warrant a smoke note.
Evidence: packages/world-dishes/data/dishes-05.jsonl:1291 (sha256 7925de411d55489492f9f3e0c58a423e6b8dd6776450e75dfcaf9ae469c79824); recipes https://de.wikibooks.org/wiki/Kochbuch%2F_Nasi_Goreng; https://nl.wikibooks.org/wiki/Kookboek%2FNasi_goreng.

### Q13393 — Onigiri

Both Japanese shortgrain rice cooked plain, filled and hand-molded round/triangular; English finishes nori wrapping. Spanish explicitly excludes sushi vinegar/sugar. Generic savory seafood/nori baseline; umeboshi or tuna-mayo can change sour/rich greatly. Rice not sticky-rice(glutinous species). New form avoids sweet rice-cake category.
Evidence: packages/world-dishes/data/dishes-02.jsonl:1536 (sha256 f12244f0e50de51c79d042db6e5a8363788b700b007b2aacd93516e3e292d3e9); recipes https://en.wikibooks.org/wiki/Cookbook%3AOnigiri; https://es.wikibooks.org/wiki/Artes_culinarias%2FRecetas%2FOnigiri.

### Q1419824 — Pavlova

English stiff whipped whites baked to crisp shell/soft center, topped whippedcream and fruit; Italian pre-made meringue topped custard/kiwi. Base egg+sugar rather than flour. Fruit gives modest sourness; vinegar small quantity not primary taste. Whipping essential transformation, new step.
Evidence: packages/world-dishes/data/dishes-03.jsonl:291 (sha256 82816de21182389c23d9f1f8acb6c8d9319a5664ed60160f499faf136b880fe7); recipes https://en.wikibooks.org/wiki/Cookbook%3APavlova; https://it.wikibooks.org/wiki/Libro_di_cucina%2FRicette%2FPavlova.

### Q697800 — Pierogi

French combines several fillings: sauerkraut, meat, potato/cheese; Italian wrapper recipe with savory and sweet garnish options. Profile representative savory potato/cheese pierogi, not fruit-sauce variant. Low sourness from fresh cheese. Base includes wrapper plus potato (not classed as noodle-dish here); uncertainty broad identity, explanatory notes prevent claims every filling identical.
Evidence: packages/world-dishes/data/dishes-06.jsonl:988 (sha256 6db147bf42b6d6a6e48906d80949f9fb48911d2b1fa800be99fe208b52e6dcbc); recipes https://fr.wikibooks.org/wiki/Livre_de_cuisine%2FPierogi; https://it.wikibooks.org/wiki/Libro_di_cucina%2FRicette%2FPierogi.

### Q283740 — Poffertjes

Both Dutch/German identical halfwheat/halfbuckwheat yeast batters rest45min, cook in molded hotpan, turn and cover with sugar/butter. Small puffy pancakes rather than thin crepe. Proof and buckwheat vocab needed; no baking despite German verb backen.
Evidence: packages/world-dishes/data/dishes-04.jsonl:1153 (sha256 a5db4c36c4d9b686c582923993d3d72add733bad3c02fe1be30c3ba75f10fe52); recipes https://de.wikibooks.org/wiki/Kochbuch%2F_Poffertjes; https://nl.wikibooks.org/wiki/Kookboek%2FPoffertjes.

### Q165112 — Popcorn

English kernels heat/shake until popped then butter/salt; Chinese adds sugar to hotfat before popping. Core puffed corn, representative butter-salt flavor. Sweetness1 baseline (Chinese version sweeter); optional cayenne/herbs not generalized. Popping is not deep frying.
Evidence: packages/world-dishes/data/dishes-03.jsonl:875 (sha256 0f7c60306e3fda23c68ae8328703ef7ce6b6bcf73caced9aa2e31a5c38bb9fc0); recipes https://en.wikibooks.org/wiki/Cookbook%3APopcorn; https://zh.wikibooks.org/wiki/%E9%A3%9F%E8%B0%B1%2F%E7%88%86%E7%B1%B3%E8%8A%B1.

### Q10398 — Pot-au-feu

French/Dutch beef cuts gently simmer with roots/leeks, clove-studded onion and herbs ~3h; broth served separately before meat/veg. No browning or braising with sauce reduction. Form proposed to avoid thick-stew inference; mustard/pickles are optional service, not defining sour baseline.
Evidence: packages/world-dishes/data/dishes-00.jsonl:540 (sha256 08edf399641ea6d64ddb5df3b6929f7f9e360a95c491daad68dc11f8991f65ea); recipes https://fr.wikibooks.org/wiki/Livre_de_cuisine%2FPot-au-feu; https://nl.wikibooks.org/wiki/Kookboek%2FPot-au-feu.

### Q20053 — Ravioli

English ravioli pasta sheets with varied fillings sealed/cut and gently boiled then tomato or butter/parmesan; Polish meat/cheese ravioli in tomato-cream sauce. Pasta-only base even though dumpling form. Generic cheese/butter/tomato dressing; actual sauce choices materially vary, sour/rich modest.
Evidence: packages/world-dishes/data/dishes-03.jsonl:2138 (sha256 e6eb10fcc54387a6a9d3e18c823fc72cd3fbb24200d5c50f35868635f6ac2047); recipes https://en.wikibooks.org/wiki/Cookbook%3ARavioli; https://pl.wikibooks.org/wiki/Ksi%C4%85%C5%BCka_kucharska%2FRavioli.

### Q20065 — Spätzle

German eggs/flour/semolina sticky batter pressed or scraped into boiling water. Italian spinach version adds ham/cream/parmesan, but core Spätzle is the plain egg noodle, distinct from existing Käsespätzle. No cheese/cream baseline; shape captures extrusion/scraping. Notes egg and wheat reflect plain flavor without fake garnishes.
Evidence: packages/world-dishes/data/dishes-03.jsonl:2154 (sha256 4114e4d923180721b65059b2d0ea8d19648aff765727252bc384278d450fc2a6); recipes https://de.wikibooks.org/wiki/Kochbuch%2F_Sp%C3%A4tzle; https://it.wikibooks.org/wiki/Libro_di_cucina%2FRicette%2FSp%C3%A4tzle.

### Q862569 — Sukiyaki

Both thin beef, vegetables,tofu simmer in sweet soy/sake/mirin sauce and dip in raw egg. Italian explicitly tabletopburner with incremental additions; English electric skillet same pattern. Beef/tofu dominate identity rather than incidental shirataki topping. No chile/numbing.
Evidence: packages/world-dishes/data/dishes-06.jsonl:2013 (sha256 3a705f12e5df24ef5f36b0583927f14fc2fdf87ef09f11e729d948139df8d112); recipes https://en.wikibooks.org/wiki/Cookbook%3ASukiyaki; https://it.wikibooks.org/wiki/Libro_di_cucina%2FRicette%2FSukiyaki.

### Q1199019 — Thousand Island dressing

English/Dutch identical mayonnaise+ketchup+vinegar+sugar+relish smooth pink dressing blended and chilled. Oil/egg represents mayonnaise emulsion rather than dairy. Sweet/tart, rich, no heat. New sauce form; no invented cream flavor.
Evidence: packages/world-dishes/data/dishes-01.jsonl:2184 (sha256 7c9a48d0374a1b7d96acd1b1c396119c00894f7bc90404d0c2d143be3f654ec4); recipes https://en.wikibooks.org/wiki/Cookbook%3AThousand_Island_Dressing; https://nl.wikibooks.org/wiki/Kookboek%2FThousand_Island_Dressing.

### Q2268672 — Tom kha kai

English coconutmilk/chickenstock simmered chicken with lemongrass,galangal,chile,lime; Dutch browns chicken/galangalpaste in coconutmilk then steeps. Core coconut+chicken, tangy citrus and moderate chiles3–4 across5servings; Dutch heat to taste. Coconut/galangal deserve precise notes, not dairy cream/ginger substitution.
Evidence: packages/world-dishes/data/dishes-04.jsonl:238 (sha256 98409157689b370fbc6033481cac443ea2ce1533668edbcd20257e6c11de034a); recipes https://en.wikibooks.org/wiki/Cookbook%3ATom_Kha_Kai; https://nl.wikibooks.org/wiki/Kookboek%2FTom_kha_kai.

### Q1142841 — Tonkatsu

English porkloin pounded, flour/egg/panko coated and shallow-fried in halfinch oil then strips, with sweet-tangy sauce; Italian same breaded pork ingredients despite typo pollo in first step. Method shallow panfry chosen accurately; tonkatsu often deepfried generally but no need override supplied source. New whole cutlet form rather than small fried pieces.
Evidence: packages/world-dishes/data/dishes-01.jsonl:1253 (sha256 880dac9beddb459d67ce981e35f4ced2d421926f16fa5933b2446ac91c4cd818); recipes https://en.wikibooks.org/wiki/Cookbook%3ATonkatsu; https://it.wikibooks.org/wiki/Libro_di_cucina%2FRicette%2FTonkatsu.

### Q1294686 — Vichyssoise

Identity explicitly chilled leek/potato/cream soup. Portuguese adds turnip then blends and optionally chills; Polish butter-softens leek, boils potato,blends,cream finish (no chill instruction). Ordinary cold identity uses chill despite variant optional. Not sweet despite erroneous kind cold sweet soup. Base potato+vegetable represents leeks; cream retained note.
Evidence: packages/world-dishes/data/dishes-02.jsonl:916 (sha256 150b5ae5a8d69325485d273ca91f557754ff9fbe51a2daa591ed103cb76f7230); recipes https://pt.wikibooks.org/wiki/Livro_de_receitas%2FVichyssoise; https://pl.wikibooks.org/wiki/Ksi%C4%85%C5%BCka_kucharska%2FVichyssoise.

### Q635675 — Waterzooi

English fish/veg stock soup enriched eggyolk/cream without boiling; German reduced wine fishbroth with celery/herbs has no cream. Choose ordinary creamy fish Waterzooi represented explicitly by English, preserve fish base rather than chickenvariant unprovided. English5Lstock/2.5Lcream/500gfish suspicious scale; not interpreted as reliable ratio. German supports lighter alternative; richness uncertain3–4.
Evidence: packages/world-dishes/data/dishes-06.jsonl:354 (sha256 f05b16486b08a30650b369abfefe09aa426000595637c03780f42157c3fc3b8a); recipes https://en.wikibooks.org/wiki/Cookbook%3AWaterzooi; https://de.wikibooks.org/wiki/Kochbuch%2F_Waterzooi.

### Q153254 — Aachener Printen

Dutch syrup/candysugar dough with orangepeel,anise,coriander,cinnamon and spiceblend rests then rolled3mm/cut rectangles/baked15min. Spiced firm biscuit, not fluffy honeycake despite generic description. No butter/egg, so low richness1. Anise note captures strong3tsp amount; syrup rather than assumed honey.
Evidence: packages/world-dishes/data/dishes-03.jsonl:469 (sha256 0a0f80739d1fe054e09d7810100d82b0a7223e09ff076ed40e5c4433fb204f2b); recipes https://nl.wikibooks.org/wiki/Kookboek%2FAachener_Printen.

### Q412754 — Ajiaco

Colombian three-potato/chicken/corn soup1h; criolla potatoes must disintegrate for creamy broth; guascas explicitly indispensable, garlic/scallion, optional capers/cream at service. Thick stew form reflects starch thickening not dairy puree. Heat0. Cream note optional representative garnish, not core base; no universal caper sourness.
Evidence: packages/world-dishes/data/dishes-05.jsonl:489 (sha256 031dcdbf8563c9e2434030fc00f865cc93f4043861ba4bc17ed22e71e9483318); recipes https://es.wikibooks.org/wiki/Artes_culinarias%2FRecetas%2FAjiaco.
