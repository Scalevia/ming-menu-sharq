// Menu content for the El Qantara East branch, transcribed from the printed menus.
//
// Item fields:
//   id        unique, stable (used in the cart)
//   ar / en   names
//   desc      Arabic description
//   price     single price, OR
//   variants  [{ id, label, price }] for size choices
//   image     optional path under public/
//   tags      optional: "special" | "best" | "new"
//   combo     true if the item can be made a combo (+config.comboPrice)

const single = (s, d) => [
  { id: "single", label: "سينجل", price: s },
  { id: "double", label: "دبل", price: d },
];
const smash = (d, t) => [
  { id: "double", label: "دبل", price: d },
  { id: "triple", label: "تريبل", price: t },
];

// Shown at the end of both menus. shared: always orderable, listed once in search.
const sharedCategories = [
  {
    id: "drinks",
    ar: "مشروبات",
    en: "Drinks",
    icon: "drink",
    shared: true,
    items: [
      { id: "ming-mojito", ar: "مينج موهيتو", en: "Ming Mojito", price: 60 },
      { id: "pepsi", ar: "بيبسي", en: "Pepsi", price: 25 },
      { id: "pepsi-diet", ar: "بيبسي دايت", en: "Pepsi Diet", price: 25 },
      { id: "red-bull", ar: "ريد بُل", en: "Red Bull", price: 65 },
    ],
  },
  {
    id: "desserts",
    ar: "حلويات",
    en: "Desserts",
    icon: "cookie",
    shared: true,
    items: [{ id: "cookies", ar: "كوكيز", en: "Cookies", price: 60 }],
  },
];

export const menus = {
  breakfast: {
    id: "breakfast",
    label: "فطار",
    categories: [
      {
        id: "breakfast-sandwiches",
        ar: "سندوتشات الفطار",
        en: "Breakfast",
        icon: "sandwich",
        items: [
          {
            id: "fries-wrap",
            ar: "فرايز راب",
            en: "Fries Wrap",
            desc: "عيش تورتيا مع بطاطس كرينكل بإضافة صوص مينج وخس طازج",
            price: 35,
            image: "img/breakfast/fries-wrap.webp",
          },
          {
            id: "pomme-frites",
            ar: "بوم فريت",
            en: "Pomme Frites",
            desc: "عيش فرنساوي طازج مع بطاطس بوم فريت بإضافة جبنة موتزاريلا وخس",
            price: 50,
            image: "img/breakfast/pomme-frites.webp",
          },
          {
            id: "cheesy-lovers",
            ar: "تشيزي لافرز",
            en: "Cheesy Lovers",
            desc: "عيش فرنساوي مع جبنة جودة وبإضافة جبنة رومي وجبنة سبريد والخس الطازج",
            price: 75,
            image: "img/breakfast/cheesy-lovers.webp",
          },
          {
            id: "turkey",
            ar: "تركي",
            en: "Turkey",
            desc: "عيش فرنساوي مع تركي مدخن بإضافة جبنة جودة والخس الطازج",
            price: 80,
            image: "img/breakfast/turkey.webp",
          },
          {
            id: "cold-cuts",
            ar: "كولد كاتس",
            en: "Cold Cuts",
            desc: "عيش فرنساوي مع رومي مدخن بإضافة سلامي وسموكد بيف",
            price: 85,
            image: "img/breakfast/cold-cuts.webp",
          },
        ],
      },
      ...sharedCategories,
    ],
  },

  lunch: {
    id: "lunch",
    label: "غدا",
    categories: [
      {
        id: "specials",
        ar: "سبيشال مينج",
        en: "Specials",
        icon: "star",
        items: [
          {
            id: "tropical-burger",
            ar: "تروبيكال برجر",
            en: "Tropical Burger",
            desc: "قطعة لحم مشوية مع شريحة أناناس بإضافة صوص مينج",
            price: 200,
            tags: ["special"],
            combo: true,
          },
          {
            id: "chicken-wrap",
            ar: "تشيكن راب",
            en: "Chicken Wrap",
            desc: "فراخ مقلية مع صوص مينج",
            price: 100,
            tags: ["best"],
            combo: true,
          },
        ],
      },
      {
        id: "chicken",
        ar: "تشيكن برجر",
        en: "Chicken Burger",
        icon: "chicken",
        items: [
          {
            id: "crispy-zinger",
            ar: "كريسبي زنجر",
            en: "Crispy Zinger",
            desc: "قطعة فراخ مقلية مع إضافة شرائح الجبنة والخس والطماطم وصوص مينج",
            variants: single(145, 195),
            combo: true,
          },
          {
            id: "crispy-ming",
            ar: "كريسبي مينج",
            en: "Crispy Ming",
            desc: "قطعة فراخ مقلية مع إضافة المشروم وصوص الكريمي مشروم",
            variants: single(150, 200),
            combo: true,
          },
          {
            id: "chicken-ranch",
            ar: "تشيكن رانش",
            en: "Chicken Ranch",
            desc: "قطعة فراخ مقلية مع إضافة التركي المدخن وشرائح الجبنة وصوص الرانش",
            variants: single(145, 195),
            combo: true,
          },
          {
            id: "sweet-chili",
            ar: "سويت تشيلي",
            en: "Sweet Chili",
            desc: "قطعة فراخ مقلية مع إضافة التركي المدخن وشرائح الجبنة وصوص سويت تشيلي",
            variants: single(145, 195),
            combo: true,
          },
        ],
      },
      {
        id: "beef",
        ar: "بيف برجر",
        en: "Beef Burger",
        icon: "burger",
        items: [
          {
            id: "classic-burger",
            ar: "كلاسيك",
            en: "Classic Burger",
            desc: "قطعة لحم مشوية بإضافة خس وشرائح الطماطم وصوص مينج",
            variants: single(145, 195),
            combo: true,
          },
          {
            id: "ming-burger",
            ar: "مينج برجر",
            en: "Ming Burger",
            desc: "قطعة لحم مشوية مع موتزاريلا ستيكس وبيف بيكون بإضافة صوص مينج",
            variants: single(160, 210),
            combo: true,
          },
          {
            id: "angry-burger",
            ar: "أنجري برجر",
            en: "Angry Burger",
            desc: "قطعة لحم مشوية مع قطعة فراخ مقلية بإضافة شرائح الجبنة وصوص تكساس",
            variants: single(170, 220),
            combo: true,
          },
          {
            id: "cheese-onion",
            ar: "تشيز أونيون",
            en: "Cheese Onion",
            desc: "قطعة لحم مشوية مع حلقات بصل وبإضافة صوص الجبنة",
            variants: single(160, 210),
            combo: true,
          },
        ],
      },
      {
        id: "smash",
        ar: "سماش برجر",
        en: "Smash Burger",
        icon: "burger",
        items: [
          {
            id: "soo-classic",
            ar: "سو كلاسيك",
            en: "Soo Classic",
            desc: "سماشد برجر لحم بقري، جبنة أمريكي، كاتشب، خس فريش، عيش بريوش",
            variants: smash(140, 200),
            combo: true,
          },
          {
            id: "creamy-mushroom-smash",
            ar: "كريمي مشروم سماش",
            en: "Creamy Mushroom Smash",
            desc: "سماشد برجر لحم بقري، جبنة أمريكي، كريمي مشروم، خس فريش، عيش بريوش",
            variants: smash(160, 210),
            combo: true,
          },
          {
            id: "cheese-smash",
            ar: "تشيز سماش",
            en: "Cheese Smash",
            desc: "سماشد برجر لحم بقري، جبنة أمريكي، صوص تشيزي، خس فريش، عيش بريوش",
            variants: smash(160, 210),
            combo: true,
          },
        ],
      },
      {
        id: "boxes",
        ar: "مينج بوكس",
        en: "Ming Box",
        icon: "box",
        items: [
          {
            id: "chicken-share-box",
            ar: "تشيكن شير بوكس",
            en: "Chicken Share Box",
            desc: "3 سندوتشات كريسبي زنجر حجم ميني",
            price: 200,
          },
          {
            id: "beef-share-box",
            ar: "بيف شير بوكس",
            en: "Beef Share Box",
            desc: "3 سندوتشات كلاسيك بيف حجم ميني",
            price: 250,
          },
        ],
      },
      {
        id: "appetizers",
        ar: "مقبلات",
        en: "Appetizers",
        icon: "fries",
        items: [
          // The printed menu has no descriptions for these three yet
          { id: "cheese-fries", ar: "تشيز فرايز", en: "Cheese Fries", price: 60 },
          { id: "loaded-fries", ar: "لوديد فرايز", en: "Loaded Fries", price: 100 },
          { id: "crispy-fries", ar: "كريسبي فرايز", en: "Crispy Fries", price: 120 },
          {
            id: "mix-appetizers",
            ar: "ميكس مقبلات",
            en: "Mix Appetizers",
            desc: "4 أصابع موتزاريلا + 4 أونيون رينج",
            price: 100,
          },
        ],
      },
      ...sharedCategories,
    ],
  },
};

export const itemPrice = (item, variantId) =>
  item.variants ? (item.variants.find((v) => v.id === variantId) ?? item.variants[0]).price : item.price;

export const minPrice = (item) => (item.variants ? Math.min(...item.variants.map((v) => v.price)) : item.price);

export function findItem(id) {
  for (const menu of Object.values(menus))
    for (const cat of menu.categories) {
      const item = cat.items.find((i) => i.id === id);
      if (item) return { item, menu, category: cat };
    }
  return null;
}
