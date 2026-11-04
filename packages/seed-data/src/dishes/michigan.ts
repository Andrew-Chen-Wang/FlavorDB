import type { Dish } from "../types"
import { flavor } from "./helpers"

export const michiganDishes: Dish[] = [
  {
    slug: "detroit-style-pizza",
    name: "Detroit-style pizza",
    category: "main",
    summary:
      "A thick, airy square pizza baked in a steel pan, with brick cheese pushed to the edges to caramelize and sauce ladled on top.",
    history: [
      "Gus Guerra created it at Buddy's Rendezvous in Detroit in 1946, baking dough in blue steel pans that were used in the auto industry for small parts.",
      "It stayed a Detroit specialty for decades and spread nationally in the 2010s.",
    ],
    places: [{ placeId: "us-detroit", note: "Buddy's, 1946" }, { placeId: "us-michigan" }],
    variations: [],
    ingredients: [
      "pizza-dough",
      "brick-cheese",
      "mozzarella",
      "tomato-sauce",
      "pork-sausage",
      "garlic",
    ],
    recipes: [],
    flavor: flavor(2, 3, 2, 0, 4, 0, 0, 1, 5),
    techniques: ["baked", "flatbread"],
  },
  {
    slug: "mackinac-fudge",
    name: "Mackinac Island fudge",
    category: "dessert",
    summary:
      "Rich fudge cooked in copper kettles and worked by hand on marble slabs until it sets.",
    history: [
      "Fudge-making came to Mackinac Island in the late 1880s. Shops worked it in their front windows to draw summer visitors.",
      "Today the car-free island has a dozen fudge shops, and tourists are nicknamed 'fudgies'.",
    ],
    places: [{ placeId: "us-mackinac" }, { placeId: "us-michigan" }],
    variations: [],
    ingredients: ["sugar", "chocolate", "butter", "cream", "corn-syrup", "salt"],
    recipes: [],
    flavor: flavor(5, 1, 0, 1, 0, 0, 0, 0, 5),
    techniques: ["confection", "boiled"],
  },
  {
    slug: "coney-dog",
    name: "Coney dog",
    category: "street food",
    summary:
      "A natural-casing hot dog topped with a beanless meat chili, yellow mustard and chopped onion.",
    history: [
      "Greek and Macedonian immigrants opened 'Coney Island' diners across the Midwest in the early 20th century. Detroit's American and Lafayette Coney Islands date from 1917 and 1924.",
    ],
    places: [{ placeId: "us-detroit" }, { placeId: "us-flint" }, { placeId: "us-michigan" }],
    variations: [
      { name: "Detroit Coney", placeId: "us-detroit", description: "A loose, soupy chili sauce." },
      {
        name: "Flint Coney",
        placeId: "us-flint",
        description: "A dry, crumbly topping made with ground beef heart.",
      },
    ],
    ingredients: [
      "pork-sausage",
      "hot-dog-bun",
      "ground-beef",
      "chili-powder",
      "cumin",
      "mustard",
      "onion",
    ],
    recipes: [],
    flavor: flavor(1, 4, 1, 0, 4, 2, 0, 1, 4),
    techniques: ["grilled", "sandwich", "street-food", "sauced"],
  },
  {
    slug: "pasty",
    name: "Pasty",
    category: "main",
    summary: "A hand pie of beef, potato, onion and rutabaga in a sturdy crust.",
    history: [
      "Cornish tin miners brought the pasty to the Upper Peninsula's copper and iron mines in the mid-1800s. Miners from Finland and Italy adopted it too.",
    ],
    places: [{ placeId: "us-upper-peninsula" }, { placeId: "gb-cornwall" }],
    variations: [
      {
        name: "Cornish pasty",
        placeId: "gb-cornwall",
        description: "Crimped along the side, with swede (rutabaga) and skirt steak.",
      },
    ],
    ingredients: ["beef", "potato", "onion", "rutabaga", "flour", "lard", "salt", "black-pepper"],
    recipes: [],
    flavor: flavor(1, 3, 0, 0, 3, 0, 0, 0, 4),
    techniques: ["baked", "pastry", "stuffed", "wrapped"],
  },
  {
    slug: "tuna-noodle-casserole",
    name: "Tuna noodle casserole",
    category: "main",
    summary:
      "Egg noodles, canned tuna and peas baked in cream of mushroom soup under a crunchy topping.",
    history: [
      "Condensed soups and canned tuna made one-dish casseroles a mid-century Midwestern weeknight standard, and a fixture of potlucks and church suppers.",
    ],
    places: [{ placeId: "us-midwest" }, { placeId: "us-michigan" }],
    variations: [
      {
        name: "Hotdish",
        placeId: "us-minneapolis",
        description:
          "The Minnesota name for the family of casseroles; tater tot hotdish is the classic.",
      },
    ],
    ingredients: ["egg-noodles", "canned-tuna", "cream-of-mushroom", "peas", "cheddar", "butter"],
    recipes: [],
    flavor: flavor(1, 3, 0, 0, 3, 0, 0, 0, 4),
    techniques: ["baked"],
  },
  {
    slug: "green-bean-casserole",
    name: "Green bean casserole",
    category: "side",
    summary: "Green beans baked in cream of mushroom soup and topped with fried onions.",
    history: [
      "Dorcas Reilly developed it in Campbell's test kitchen in 1955; it became a Thanksgiving standard.",
    ],
    places: [{ placeId: "us" }, { placeId: "us-midwest" }],
    variations: [],
    ingredients: [
      "green-beans",
      "cream-of-mushroom",
      "fried-onions",
      "milk",
      "soy-sauce",
      "black-pepper",
    ],
    recipes: [],
    flavor: flavor(1, 3, 0, 0, 3, 0, 0, 0, 3),
    techniques: ["baked"],
  },
]
