# Batch 02 manual profile review

Read all 30 full records, ingredient lines, recipe steps, descriptions and source metadata. Compared identities against every supplied curated dish and existing WorldLink: no duplicates found. Countries copied exactly; no translated Chinese names promoted to local names for non-Chinese dishes. Only Beggar's chicken uses its supplied Chinese recipe name.

29 profiles produced, in input order. Bingfen (Q103839692) explicitly deferred: source is mint-flavored seed jelly with no sweetener specified and includes a water-activated light-up ice-cube accessory among ingredients. It does not establish an ordinary sweet syrup/topping profile, and the only supplied primary aromatic is mint. A sweet/two-note profile would require assumptions. Needs a normal edible-recipe source or independent review; no fabricated flavor values. Full source: https://github.com/Anduin2017/HowToCook/blob/master/dishes/drink/冰粉/冰粉.md

## Proposed vocabulary for parent review

Form leaves:

- cake -> [baked, sweets]: creamed fruit cakes, not quick bread.
- flatbread -> [bread-based, griddled]: plain griddled arepa.
- dip -> [cold-dish]: pureed vegetable/tahini spread.
- savory-pie -> [baked]: savory enclosed pie, excludes sweets.
- layered-pastry -> [baked, sweets]: syrup-soaked filo layers.
- ice-cream-dessert -> [sweets, cold-dish]: scooped frozen dessert assembly.
- meat-and-mash -> []: plated sausages and mashed potato; no existing root accurately covers both, parent may introduce a general plated-dish grouping.
- chilled-pie -> [sweets, cold-dish]: crumb-base pie set by chilling, no baked parent.
- croquette -> [fried-crisp]: breaded, creamy ragout-centered fried balls.
- meat-sauce -> [in-sauce]: minced meat ragù, distinct from pieces in sauce.
- baked-pudding -> [baked, sweets]: soaked bread/custard baked soft.
- flatbread-wrap -> [wrapped, bread-based]: tortilla wraps.
- grilled-slices -> [sliced-meat]: thin marinated grilled beef.
- fried-filled-pastry -> [wrapped, fried-crisp, sweets]: cannoli; fried shell, not baked filled-pastry.
- bread-bowl -> [bread-based]: hollowed loaf with curry.
- smooth-sauce -> [in-sauce]: roux-thickened milk sauce, no solid pieces.
- salad -> [cold-dish]: raw dressed/composed vegetables.

Base leaves:

- nuts -> []: independent food family; baklava nut filling cannot be accurately represented as grain/fruit.
- eggplant -> [vegetable].
- beet -> [vegetable].
- lettuce -> [vegetable].
- tomato -> [vegetable] (culinary use here).

Steps: puree (blending cooked eggplant), mash (boiled potato), layer (filo or biryani assembly), make-roux (fat/flour cooked as thickener), pickle (vinegar-preserved sandwich vegetables).

Flavor notes: nuts (ground nuts/pine nuts/walnuts), molasses (baked beans), caramel (banoffee/toffee and baked brown-sugar filling). These are supported specific aromatics beyond basic sweetness.

No tracked edits. Parent should review and add/normalize proposed vocabulary before applying these profiles. Flavor intensities are reasoned estimates rather than measured data. Browser/ranking validation remains with parent after integration.

## Per-dish evidence and uncertainty

### Q3276353 — Apple cake

Creamed butter batter, chopped apples, cinnamon and nutmeg baked 45 minutes. Cake leaf required; not bread or pie. Whipped cream is optional serving accompaniment.

Evidence: https://en.wikibooks.org/wiki/Cookbook%3AApple_Cake

### Q642702 — Arepa

Maize dough flattened into thick rounds and griddled. Frying/baking and cheese are explicit alternatives; represent plain griddled arepa.

Evidence: https://es.wikibooks.org/wiki/Artes_culinarias%2FRecetas%2FArepa

### Q703836 — Arroz con pollo

Chicken and sofrito with broth-cooked rice. Recipe contains three versions inside steps: first is a complete one-pot rice method; third separately cooks and assembles shredded chicken. Countries copied as supplied ES despite broader Latin American identity.

Evidence: https://es.wikibooks.org/wiki/Artes_culinarias%2FRecetas%2FArroz_con_pollo

### Q24837089 — Ayam buah keluak

Chicken simmered with tamarind, shrimp paste, galangal, lemongrass and filled nut shells, then chilled overnight and reheated. Italian recipe calls nuts Bancoul, conflicting with the buah keluak identity; do not infer a candlenut base. This is a cautious chicken/tamarind/fermented-seafood profile; nut-specific taste uncertain. No chili named, so heat remains zero.

Evidence: https://it.wikibooks.org/wiki/Libro_di_cucina%2FRicette%2FAyam_Buah_Keluak

### Q1072192 — Baba ghanoush

Ordinary identity in description is roasted eggplant with tahini; supplied Spanish variant instead pan-fries eggplant and onion before blending. Profile ordinary roasted identity, low smoke rather than heavy char; mark recipe process variation.

Evidence: https://es.wikibooks.org/wiki/Artes_culinarias%2FRecetas%2FBaba_ghanoush

### Q4839943 — Bacon and egg pie

Double shortcrust shell encloses bacon and eggs. Savory pie must not inherit sweets via existing pie form. Mild bacon smoke is variable and low.

Evidence: https://en.wikibooks.org/wiki/Cookbook%3ABacon_and_Egg_Pie

### Q804297 — Baked beans

Navy-type beans baked slowly with bacon, brown sugar and molasses. Supplied recipe has no tomato despite general description; follows explicit sweet US baked-bean variant. Soak optional if canned beans.

Evidence: https://en.wikibooks.org/wiki/Cookbook%3ABaked_Beans

### Q187495 — Baklava

Butter-brushed filo layers with ground nuts/cinnamon, baked and drenched in honey/sugar syrup. Layering distinguishes from filled hand pastry. Nut type varies among pistachio/walnut and other nuts.

Evidence: https://es.wikibooks.org/wiki/Artes_culinarias%2FRecetas%2FBaklava

### Q16172783 — Banana cake

Creamed butter batter with mashed ripe bananas, buttermilk and cinnamon. Frosting optional and excluded from defining steps.

Evidence: https://en.wikibooks.org/wiki/Cookbook%3ABanana_Cake

### Q245752 — Banana split

Banana halves with scoops of ice cream, whipped cream and sauces/toppings. Chocolate supported by ordinary ingredient list; sauce flavors vary. Not a baked confection.

Evidence: https://fr.wikibooks.org/wiki/Livre_de_cuisine%2FBanana_split

### Q2882471 — Bangers and mash

Gently pan-fried sausages served alongside boiled potatoes mashed with butter and milk. Parallel preparation ordered as recipe; no gravy/onion sauce invented. New plated form needed.

Evidence: https://en.wikibooks.org/wiki/Cookbook%3ABangers_and_Mash

### Q2748774 — Banoffee pie

Biscuit crumb base, banana, butter/sugar/condensed-milk caramel, chilled and topped with whipped cream. Existing baked pie parent is inaccurate for this no-bake construction. Fruit/dairy represent filling identity over optional biscuit choice.

Evidence: https://en.wikibooks.org/wiki/Cookbook%3ABanoffee_Pie

### Q4880437 — Beggar's chicken

Whole chicken marinated in soy/wine, aromatic filling cooked, wrapped in lotus leaf and clay and baked slowly. Description explicitly says stuffed; supplied steps prepare filling but omit explicit stuffing instruction. Clay is shell rather than base.

Evidence: https://zh.wikibooks.org/wiki/%E9%A3%9F%E8%B0%B1%2F%E5%8F%AB%E5%8C%96%E9%B8%A1

### Q648352 — Bibimbap

Separate blanched vegetables, browned beef, egg, sesame and gochujang/kimchi arranged on rice and mixed to eat. Dolsot crisping is an optional later variation and not universal; no griddle step or fried-crust note in ordinary profile.

Evidence: https://en.wikibooks.org/wiki/Cookbook%3ABibimbap

### Q271555 — Biryani

Marinated chicken layered with partly cooked spiced rice, lentils/potatoes/eggs and ghee, tightly sealed until moisture absorbed. Specific chicken variant supports richness and moderate chili; base does not enumerate every topping. Final sealed dum cooking represented by steam.

Evidence: https://en.wikibooks.org/wiki/Cookbook%3ABiryani

### Q878961 — Bitterballen

Cooked chopped meat incorporated in thick roux sauce, cooled to set, rolled into balls, twice crumbed and fried. Croquette leaf distinguishes creamy filling from generic fried meat pieces. Source permits other cooked meat but ordinary beef identity used.

Evidence: https://nl.wikibooks.org/wiki/Kookboek%2FBitterballen

### Q1162965 — Bolognese sauce

Minced beef browned then long-simmered with tomatoes. Source has egg whites and much garlic/oregano, unlike many traditional Bolognese recipes; common identity remains beef ragù. No milk/wine note inferred merely from generic labels. This is sauce, not pasta dish.

Evidence: https://en.wikibooks.org/wiki/Cookbook%3ABolognese_Sauce

### Q4551 — Borscht

Beet/potato/cabbage soup with dill, vinegar, small sugar addition and optional sour cream. Broth is unthickened, so clear-soup rather than creamy-soup; cream note reflects customary explicitly supplied topping. Vegetable-based supplied recipe, no beef invented.

Evidence: https://en.wikibooks.org/wiki/Cookbook%3ABorscht

### Q990900 — Bread pudding

Bread pieces absorb egg/milk/sugar/cinnamon custard, baked into soft pudding. Optional raisins omitted from defining base/notes. New pudding form avoids cake/casserole misclassification.

Evidence: https://en.wikibooks.org/wiki/Cookbook%3ABread_Pudding

### Q25004446 — Breakfast burrito

Flour tortilla encloses cooked eggs, bacon/sausage, hash browns and optional cheese/hollandaise. Source begins with cooked filling, so do not impose one egg cooking method. Mild bacon smoke is variant-dependent.

Evidence: https://en.wikibooks.org/wiki/Cookbook%3ABreakfast_Burrito

### Q683682 — Bulgogi

Thin beef in soy/sugar/sesame/garlic marinade, then grilled. No chili in recipe: black pepper does not justify chili heat. Grilled-slice form avoids roast or stir-fry mislabel.

Evidence: https://en.wikibooks.org/wiki/Cookbook%3ABulgogi

### Q4997887 — Bunny chow

Bread loaf hollowed and filled with simmered curry. Meat alternatives beef/mutton/chicken or vegetables; meat base captures ordinary meat identity without selecting an arbitrary species. Curry-powder heat varies; modest 2. New bread-bowl form rather than closed sandwich.

Evidence: https://en.wikibooks.org/wiki/Cookbook%3ABunny_Chow

### Q5002850 — Butter tart

Small pastry shells with buttery brown-sugar/corn-syrup/egg filling, raisins/currants and walnuts. Tart form already fits. Caramel note denotes baked brown-sugar syrup; raisins/nuts source-supported, not universal across all butter tarts.

Evidence: https://en.wikibooks.org/wiki/Cookbook%3AButter_Tart

### Q615392 — Bánh mì

Baguette sandwiches with sweet-vinegar carrot/daikon pickle, herbs, cucumber, mild jalapeño and chosen fillings. Long alternatives include meat/fish/tofu and sauces; bread-only base avoids encoding mutually exclusive fillings. Heat modest; no mandatory grill/smoke.

Evidence: https://en.wikibooks.org/wiki/Cookbook%3AB%C3%A1nh_M%C3%AC

### Q209974 — Béchamel

Pale butter/flour roux diluted with milk, gently simmered with nutmeg/clove/onion/bay until smooth. Pinch cayenne does not define appreciable heat. Not a soup; sauce leaf needed.

Evidence: https://fr.wikibooks.org/wiki/Livre_de_cuisine%2FB%C3%A9chamel

### Q275508 — Caesar salad

Romaine tossed with oil, vinegar, Worcestershire and soft eggs, topped with garlic croutons. Parmesan present in ordinary ingredient list but omitted from supplied recipe; cheese note follows canonical metadata, moderate richness. No anchovy fillet step invented.

Evidence: https://en.wikibooks.org/wiki/Cookbook%3ACaesar_Salad

### Q836151 — Cannoli

Crisp cannoli shells filled with sweet ricotta/whipped cream/chocolate chips then chilled. Recipe starts from prepared shells; deep-fry encodes defining ordinary shell production rather than assuming baking. Shell method not described locally: identity-supported process inference flagged.

Evidence: https://en.wikibooks.org/wiki/Cookbook%3ACannoli

### Q1034806 — Caponata

Eggplant/peppers sautéed, cooked with tomato/celery/olives/capers/pine nuts, sweetened vinegar added, served cold. Cold service explicit; chill represents cooling, not specified refrigeration. No garlic/chili invented.

Evidence: https://it.wikibooks.org/wiki/Libro_di_cucina%2FRicette%2FCaponata

### Q568364 — Caprese salad

Raw tomato slices layered with mozzarella and basil, oil/vinegar drizzled. Balsamic is explicit supplied variation and contributes sourness 2, not mandatory universally. Salad form also appropriate for composed slices, not raw-cubes.

Evidence: https://en.wikibooks.org/wiki/Cookbook%3ACaprese_Salad
