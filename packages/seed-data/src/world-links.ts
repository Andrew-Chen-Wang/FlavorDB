import { flavor } from "./dishes/helpers"
import type { Profile } from "./profiles"
import type { FlavorProfile } from "./types"

/**
 * Dishes from the imported world collection (`@flavor-db/world-dishes`) that are hand-profiled so
 * they can show up as similar dishes. The id is the world dish id (a Wikidata QID), and the page
 * lives at /world/<id>. Mostly noodle dishes so far, so a noodle dish can be matched with noodles
 * from other cultures, not only with whatever else is in the curated set.
 */
export type WorldLink = {
  id: string
  name: string
  localName?: string
  countries: string[]
  flavor: FlavorProfile
  profile: Profile
}

//                    sweet salty sour bitter umami spicy numbing smoky rich
export const worldLinks: WorldLink[] = [
  // Stir-fried noodles
  {
    id: "Q730298",
    name: "Pad thai",
    localName: "ผัดไทย",
    countries: ["TH"],
    flavor: flavor(3, 3, 3, 0, 4, 1, 0, 0, 2),
    profile: {
      form: "fried-noodles",
      base: ["flat-rice-noodles"],
      steps: ["soak", "stir-fry"],
      notes: ["peanut", "citrus", "seafood", "egg", "chili"],
    },
  },
  {
    id: "Q5309357",
    name: "Drunken noodles",
    localName: "ผัดขี้เมา",
    countries: ["TH"],
    flavor: flavor(1, 4, 0, 0, 4, 4, 0, 1, 2),
    profile: {
      form: "fried-noodles",
      base: ["flat-rice-noodles"],
      steps: ["stir-fry"],
      notes: ["chili", "garlic", "herbs", "soy", "wok-hei"],
    },
  },
  {
    id: "Q6685108",
    name: "Pad see ew",
    localName: "ผัดซีอิ๊ว",
    countries: ["TH"],
    flavor: flavor(2, 4, 0, 0, 4, 0, 0, 1, 3),
    profile: {
      form: "fried-noodles",
      base: ["flat-rice-noodles"],
      steps: ["stir-fry"],
      notes: ["soy", "sweet-glaze", "egg", "garlic", "wok-hei"],
    },
  },
  {
    id: "Q837647",
    name: "Dry-fried beef ho fun",
    localName: "干炒牛河",
    countries: ["CN", "HK"],
    flavor: flavor(1, 4, 0, 0, 4, 0, 0, 2, 3),
    profile: {
      form: "fried-noodles",
      base: ["flat-rice-noodles"],
      steps: ["marinate", "stir-fry"],
      notes: ["soy", "wok-hei", "scallion"],
    },
  },
  {
    id: "Q3270149",
    name: "Singapore-style noodles",
    localName: "星洲炒米",
    countries: ["HK"],
    flavor: flavor(1, 3, 0, 0, 3, 2, 0, 0, 2),
    profile: {
      form: "fried-noodles",
      base: ["rice-vermicelli"],
      steps: ["soak", "stir-fry"],
      notes: ["warm-spice", "seafood", "egg", "wok-hei"],
    },
  },
  {
    id: "Q1886310",
    name: "Mee siam",
    countries: ["MY", "SG"],
    flavor: flavor(2, 3, 3, 0, 3, 3, 0, 0, 2),
    profile: {
      form: "fried-noodles",
      base: ["rice-vermicelli"],
      steps: ["soak", "stir-fry"],
      notes: ["chili", "citrus", "fermented-bean", "seafood", "egg"],
    },
  },
  {
    id: "Q3382152",
    name: "Phở xào",
    countries: ["VN"],
    flavor: flavor(1, 4, 0, 0, 4, 0, 0, 1, 2),
    profile: {
      form: "fried-noodles",
      base: ["flat-rice-noodles"],
      steps: ["stir-fry"],
      notes: ["soy", "garlic", "herbs", "wok-hei"],
    },
  },
  {
    id: "Q3307839",
    name: "Mì xào",
    countries: ["VN"],
    flavor: flavor(1, 4, 0, 0, 4, 0, 0, 1, 2),
    profile: {
      form: "fried-noodles",
      base: ["egg-noodles"],
      steps: ["boil", "stir-fry"],
      notes: ["soy", "garlic", "seafood", "wok-hei"],
    },
  },
  {
    id: "Q964107",
    name: "Chow mein",
    localName: "炒面",
    countries: ["CN", "US"],
    flavor: flavor(1, 4, 0, 0, 4, 0, 0, 1, 2),
    profile: {
      form: "fried-noodles",
      base: ["egg-noodles"],
      steps: ["boil", "stir-fry"],
      notes: ["soy", "wok-hei", "garlic", "scallion"],
    },
  },
  {
    id: "Q96246664",
    name: "Hokkien char mee",
    localName: "福建炒面",
    countries: ["MY"],
    flavor: flavor(2, 4, 0, 0, 5, 0, 0, 1, 4),
    profile: {
      form: "fried-noodles",
      base: ["thick-wheat-noodles"],
      steps: ["stir-fry", "braise"],
      notes: ["soy", "pork-fat", "seafood", "wok-hei"],
    },
  },
  {
    id: "Q8053485",
    name: "Yi mein",
    localName: "伊麵",
    countries: ["CN", "HK"],
    flavor: flavor(1, 3, 0, 0, 4, 0, 0, 0, 3),
    profile: {
      form: "fried-noodles",
      base: ["egg-noodles"],
      steps: ["deep-fry", "boil", "stir-fry"],
      notes: ["soy", "scallion"],
    },
  },
  {
    id: "Q864174",
    name: "Ants climbing a tree",
    localName: "蚂蚁上树",
    countries: ["CN"],
    flavor: flavor(1, 4, 0, 0, 4, 3, 1, 0, 3),
    profile: {
      form: "fried-noodles",
      base: ["starch-noodles"],
      steps: ["soak", "stir-fry", "braise"],
      notes: ["fermented-bean", "chili", "garlic", "ginger", "pork-fat"],
    },
  },
  {
    id: "Q1144102",
    name: "Yakisoba",
    localName: "焼きそば",
    countries: ["JP"],
    flavor: flavor(3, 4, 2, 0, 4, 0, 0, 1, 2),
    profile: {
      form: "fried-noodles",
      base: ["alkaline-noodles"],
      steps: ["stir-fry"],
      notes: ["sweet-glaze", "pickle", "seafood", "wok-hei"],
    },
  },
  {
    id: "Q1188380",
    name: "Yaki udon",
    localName: "焼きうどん",
    countries: ["JP"],
    flavor: flavor(1, 4, 0, 0, 4, 0, 0, 0, 2),
    profile: {
      form: "fried-noodles",
      base: ["thick-wheat-noodles"],
      steps: ["boil", "stir-fry"],
      notes: ["soy", "seafood", "scallion"],
    },
  },
  {
    id: "Q715040",
    name: "Japchae",
    localName: "잡채",
    countries: ["KR"],
    flavor: flavor(3, 3, 0, 0, 3, 0, 0, 0, 2),
    profile: {
      form: "fried-noodles",
      base: ["starch-noodles"],
      steps: ["boil", "stir-fry", "toss"],
      notes: ["soy", "sesame", "sweet-glaze", "garlic"],
    },
  },
  {
    id: "Q1188729",
    name: "Mie goreng",
    countries: ["ID", "MY", "SG"],
    flavor: flavor(3, 4, 0, 0, 4, 3, 0, 1, 3),
    profile: {
      form: "fried-noodles",
      base: ["egg-noodles"],
      steps: ["boil", "stir-fry"],
      notes: ["sweet-glaze", "chili", "garlic", "egg", "fried-crust"],
    },
  },
  {
    id: "Q4208154",
    name: "Mie aceh",
    countries: ["ID"],
    flavor: flavor(1, 3, 0, 0, 4, 4, 0, 0, 3),
    profile: {
      form: "fried-noodles",
      base: ["thick-wheat-noodles"],
      steps: ["stir-fry"],
      notes: ["warm-spice", "chili", "seafood", "garlic"],
    },
  },
  {
    id: "Q20016",
    name: "Fideuà",
    countries: ["ES"],
    flavor: flavor(1, 3, 0, 0, 4, 0, 0, 1, 3),
    profile: {
      form: "fried-noodles",
      base: ["pasta"],
      steps: ["pan-fry", "simmer"],
      notes: ["seafood", "garlic", "tomato", "broth"],
    },
  },

  // Noodles tossed in sauce
  {
    id: "Q44737",
    name: "Zhajiangmian",
    localName: "炸酱面",
    countries: ["CN"],
    flavor: flavor(2, 5, 0, 0, 5, 0, 0, 0, 4),
    profile: {
      form: "dry-noodles",
      base: ["wheat-noodles"],
      steps: ["pan-fry", "boil", "toss"],
      notes: ["fermented-bean", "pork-fat", "soy"],
    },
  },
  {
    id: "Q213105",
    name: "Biangbiang noodles",
    localName: "𰻝𰻝面",
    countries: ["CN"],
    flavor: flavor(0, 3, 3, 0, 3, 4, 0, 0, 3),
    profile: {
      form: "dry-noodles",
      base: ["hand-pulled-noodles"],
      steps: ["make-dough", "boil", "top", "toss"],
      notes: ["chili", "garlic", "vinegar", "scallion"],
    },
  },
  {
    id: "Q15955061",
    name: "Shanxi knife-cut noodles",
    localName: "山西刀削面",
    countries: ["CN"],
    flavor: flavor(1, 4, 2, 0, 4, 1, 0, 0, 3),
    profile: {
      form: "dry-noodles",
      base: ["thick-wheat-noodles"],
      steps: ["make-dough", "boil", "top"],
      notes: ["vinegar", "soy", "tomato"],
    },
  },
  {
    id: "Q35778572",
    name: "Laghman",
    localName: "拉条子",
    countries: ["CN", "UZ", "KG", "KZ"],
    flavor: flavor(1, 3, 2, 0, 4, 2, 0, 0, 3),
    profile: {
      form: "dry-noodles",
      base: ["hand-pulled-noodles"],
      steps: ["make-dough", "boil", "stir-fry", "top"],
      notes: ["tomato", "cumin", "chili", "garlic"],
    },
  },
  {
    id: "Q1141033",
    name: "Jajangmyeon",
    localName: "짜장면",
    countries: ["KR"],
    flavor: flavor(3, 4, 0, 1, 4, 0, 0, 0, 4),
    profile: {
      form: "dry-noodles",
      base: ["wheat-noodles"],
      steps: ["stir-fry", "thicken", "boil", "top"],
      notes: ["fermented-bean", "pork-fat", "sweet-glaze"],
    },
  },
  {
    id: "Q1419233",
    name: "Spaghetti aglio, olio e peperoncino",
    countries: ["IT"],
    flavor: flavor(0, 3, 0, 0, 2, 3, 0, 0, 3),
    profile: {
      form: "dry-noodles",
      base: ["pasta"],
      steps: ["boil", "pan-fry", "toss"],
      notes: ["garlic", "chili", "herbs"],
    },
  },
  {
    id: "Q876624",
    name: "Carbonara",
    countries: ["IT"],
    flavor: flavor(0, 4, 0, 0, 4, 0, 0, 1, 5),
    profile: {
      form: "dry-noodles",
      base: ["pasta"],
      steps: ["boil", "pan-fry", "toss"],
      notes: ["egg", "cheese", "pork-fat", "black-pepper"],
    },
  },
  {
    id: "Q1124851",
    name: "Käsespätzle",
    countries: ["DE"],
    flavor: flavor(1, 4, 0, 0, 4, 0, 0, 0, 5),
    profile: {
      form: "noodle-casserole",
      base: ["egg-noodles"],
      steps: ["make-batter", "boil", "bake"],
      notes: ["cheese", "butter", "fried-crust"],
    },
  },

  // Cold noodles
  {
    id: "Q6540048",
    name: "Liangpi",
    localName: "凉皮",
    countries: ["CN"],
    flavor: flavor(1, 3, 4, 0, 3, 4, 1, 0, 2),
    profile: {
      form: "cold-noodles",
      base: ["wheat-noodles"],
      steps: ["make-batter", "steam", "slice", "chill", "toss"],
      notes: ["chili", "vinegar", "garlic", "sesame"],
    },
  },
  {
    id: "Q711953",
    name: "Bibim guksu",
    localName: "비빔국수",
    countries: ["KR"],
    flavor: flavor(3, 3, 3, 0, 2, 4, 0, 0, 1),
    profile: {
      form: "cold-noodles",
      base: ["wheat-noodles"],
      steps: ["boil", "chill", "toss"],
      notes: ["chili", "vinegar", "sesame", "sweet-glaze"],
    },
  },
  {
    id: "Q715084",
    name: "Naengmyeon",
    localName: "냉면",
    countries: ["KR", "KP"],
    flavor: flavor(2, 3, 3, 0, 3, 1, 0, 0, 1),
    profile: {
      form: "cold-noodles",
      base: ["buckwheat-noodles"],
      steps: ["boil", "chill", "assemble"],
      notes: ["broth", "vinegar", "mustard", "pickle"],
    },
  },
  {
    id: "Q5005249",
    name: "Bún thịt nướng",
    countries: ["VN"],
    flavor: flavor(3, 3, 3, 0, 3, 1, 0, 1, 2),
    profile: {
      form: "cold-noodles",
      base: ["round-rice-noodles"],
      steps: ["marinate", "grill", "boil", "assemble"],
      notes: ["herbs", "seafood", "charred", "peanut", "citrus"],
    },
  },

  // Noodle soups
  {
    id: "Q7211268",
    name: "Luosifen",
    localName: "螺蛳粉",
    countries: ["CN"],
    flavor: flavor(0, 4, 4, 0, 4, 4, 0, 0, 3),
    profile: {
      form: "noodle-soup",
      base: ["round-rice-noodles"],
      steps: ["soak", "simmer", "boil", "assemble"],
      notes: ["funk", "chili", "pickle", "seafood", "peanut"],
    },
  },
  {
    id: "Q131400142",
    name: "Suan la fen",
    localName: "酸辣粉",
    countries: ["CN"],
    flavor: flavor(0, 4, 4, 0, 3, 5, 3, 0, 2),
    profile: {
      form: "noodle-soup",
      base: ["starch-noodles"],
      steps: ["soak", "boil", "assemble"],
      notes: ["chili", "vinegar", "sichuan-pepper", "peanut", "pickle"],
    },
  },
  {
    id: "Q234646",
    name: "Ramen",
    localName: "ラーメン",
    countries: ["JP"],
    flavor: flavor(1, 4, 0, 0, 5, 1, 0, 0, 4),
    profile: {
      form: "noodle-soup",
      base: ["alkaline-noodles"],
      steps: ["simmer", "boil", "assemble"],
      notes: ["broth", "soy", "pork-fat", "egg", "scallion"],
    },
  },
  {
    id: "Q17063016",
    name: "Jjamppong",
    localName: "짬뽕",
    countries: ["KR"],
    flavor: flavor(0, 4, 0, 0, 4, 4, 0, 2, 3),
    profile: {
      form: "noodle-soup",
      base: ["wheat-noodles"],
      steps: ["stir-fry", "simmer", "boil", "assemble"],
      notes: ["chili", "seafood", "wok-hei", "garlic", "broth"],
    },
  },
  {
    id: "Q420646",
    name: "Phở",
    countries: ["VN"],
    flavor: flavor(1, 3, 1, 0, 4, 1, 0, 0, 2),
    profile: {
      form: "noodle-soup",
      base: ["flat-rice-noodles"],
      steps: ["simmer", "boil", "assemble"],
      notes: ["broth", "herbs", "star-anise", "citrus", "ginger"],
    },
  },
  {
    id: "Q1130800",
    name: "Bún bò Huế",
    countries: ["VN"],
    flavor: flavor(1, 4, 1, 0, 4, 4, 0, 0, 3),
    profile: {
      form: "noodle-soup",
      base: ["round-rice-noodles"],
      steps: ["simmer", "boil", "assemble"],
      notes: ["broth", "chili", "citrus", "seafood", "herbs"],
    },
  },
  {
    id: "Q934095",
    name: "Laksa",
    countries: ["MY", "SG", "ID"],
    flavor: flavor(2, 3, 2, 0, 4, 4, 0, 0, 4),
    profile: {
      form: "noodle-soup",
      base: ["rice-vermicelli"],
      steps: ["simmer", "boil", "assemble"],
      notes: ["chili", "seafood", "cream", "warm-spice", "herbs"],
    },
  },
  {
    id: "Q4922950",
    name: "Khao soi",
    localName: "ข้าวซอย",
    countries: ["TH", "LA", "MM"],
    flavor: flavor(2, 3, 2, 0, 3, 3, 0, 0, 4),
    profile: {
      form: "noodle-soup",
      base: ["egg-noodles"],
      steps: ["simmer", "boil", "deep-fry", "assemble"],
      notes: ["warm-spice", "cream", "chili", "pickle", "citrus", "fried-crust"],
    },
  },
  {
    id: "Q1188066",
    name: "Mohinga",
    countries: ["MM"],
    flavor: flavor(1, 3, 1, 0, 4, 2, 0, 0, 3),
    profile: {
      form: "noodle-soup",
      base: ["rice-vermicelli"],
      steps: ["simmer", "boil", "assemble"],
      notes: ["seafood", "citrus", "ginger", "fried-crust", "herbs"],
    },
  },
  {
    id: "Q607114",
    name: "Thukpa",
    countries: ["CN", "NP", "IN", "BT"],
    flavor: flavor(0, 3, 0, 0, 3, 2, 0, 0, 2),
    profile: {
      form: "noodle-soup",
      base: ["wheat-noodles"],
      steps: ["make-dough", "simmer", "boil"],
      notes: ["broth", "ginger", "garlic", "chili"],
    },
  },
]
