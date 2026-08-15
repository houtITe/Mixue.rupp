export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  images?: string[];
  short: string;
  description: string;
  tags: string[];
  featured?: boolean;
  isNew?: boolean;
  bestSeller?: boolean;
  onSale?: boolean;
  rating?: number;
  reviews?: number;
  inStock?: boolean;
  stock?: number;
  calories?: number;
  prepTime?: string;
  createdAt?: number;
};

// One-time starter menu — used only by the "Import starter menu" button in
// Admin → Products when the live Firestore catalog is empty. The live site
// and admin panel both read from Firestore (see ProductsContext), not from
// this array, once products have been imported.
export const seedProducts: Product[] = [
  {
    id: "classic-vanilla-cone",
    name: "Classic Vanilla Cone",
    category: "Ice Cream",
    price: 1.25,
    image:
      "https://website-admin.snowking.cn/profile/upload/2024/03/21/home-one-3_20240321175911A121.png",
    short: "Silky vanilla soft-serve on a crisp golden cone.",
    description:
      "Our signature Classic Vanilla Cone — creamy, cold and impossibly smooth, hand-swirled on a freshly baked golden waffle cone. The ultimate campus classic since day one.",
    tags: ["signature", "bestseller", "cold"],
    featured: true,
    bestSeller: true,
    rating: 4.9,
    reviews: 312,
    inStock: true,
    calories: 180,
    prepTime: "1 min",
  },
  {
    id: "strawberry-swirl",
    name: "Strawberry Swirl Sundae",
    category: "Ice Cream",
    price: 2.5,
    oldPrice: 3.0,
    image:
      "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=1200&q=80",
    short: "Vanilla soft-serve marbled with real strawberry sauce.",
    description:
      "A generous swirl of creamy soft-serve marbled with real strawberry compote, topped with fresh berry chunks. Sweet, tangy and refreshing.",
    tags: ["fruity", "sweet"],
    onSale: true,
    rating: 4.7,
    reviews: 148,
    inStock: true,
    calories: 260,
  },
  {
    id: "matcha-boba",
    name: "Matcha Milk Boba",
    category: "Bubble Tea",
    price: 2.75,
    image:
      "https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=1200&q=80",
    short: "Ceremonial-grade matcha, creamy milk and chewy pearls.",
    description:
      "Stone-ground ceremonial matcha whisked into cold fresh milk and finished with hand-cooked brown-sugar tapioca pearls. Earthy, sweet, iconic.",
    tags: ["signature", "milk", "matcha"],
    featured: true,
    bestSeller: true,
    rating: 4.8,
    reviews: 264,
    inStock: true,
    calories: 240,
  },
  {
    id: "brown-sugar-milk-tea",
    name: "Brown Sugar Milk Tea",
    category: "Bubble Tea",
    price: 2.5,
    image:
      "https://images.unsplash.com/photo-1541696490-8744a5dc0228?auto=format&fit=crop&w=1200&q=80",
    short: "Caramelised brown sugar tiger stripes over creamy milk tea.",
    description:
      "Slow-caramelised brown sugar syrup drizzled into fresh milk and black tea over warm tapioca pearls. Rich, cozy and unforgettable.",
    tags: ["bestseller", "sweet"],
    featured: true,
    bestSeller: true,
    rating: 4.9,
    reviews: 401,
    inStock: true,
  },
  {
    id: "lemon-yakult",
    name: "Lemon Yakult Fizz",
    category: "Fruit Tea",
    price: 2.25,
    image:
      "https://images.unsplash.com/photo-1523371683702-1236eab88d55?auto=format&fit=crop&w=1200&q=80",
    short: "Zesty lemon, chilled yakult, and a splash of sparkle.",
    description:
      "Freshly juiced lemons shaken with cold yakult and a hint of honey — bright, bubbly and made for hot Phnom Penh afternoons.",
    tags: ["refreshing", "citrus"],
    isNew: true,
    rating: 4.6,
    reviews: 92,
    inStock: true,
  },
  {
    id: "mango-passion",
    name: "Mango Passion Tea",
    category: "Fruit Tea",
    price: 2.5,
    image:
      "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=1200&q=80",
    short: "Alphonso mango, passionfruit pulp and jasmine green tea.",
    description:
      "Cold-brewed jasmine green tea layered with ripe mango puree and tangy passionfruit seeds. Tropical, sunny and full of vitamin C.",
    tags: ["tropical", "fruity"],
    featured: true,
    rating: 4.8,
    reviews: 187,
    inStock: true,
  },
  {
    id: "iced-mocha",
    name: "RUPP Iced Mocha",
    category: "Coffee",
    price: 2.75,
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=1200&q=80",
    short: "Cambodian espresso, dark chocolate and cold milk.",
    description:
      "Double-shot local espresso melted into dark chocolate ganache and cold fresh milk. The fuel of every all-nighter on campus.",
    tags: ["caffeine", "chocolate"],
    rating: 4.7,
    reviews: 133,
    inStock: true,
  },
  {
    id: "berry-smoothie",
    name: "Triple Berry Smoothie",
    category: "Smoothie",
    price: 3.0,
    image:
      "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=1200&q=80",
    short: "Strawberry, blueberry and raspberry blended with yogurt.",
    description:
      "A thick blend of frozen strawberries, blueberries and raspberries with creamy yogurt and a drizzle of local honey. Antioxidant-packed goodness.",
    tags: ["healthy", "fruity"],
    isNew: true,
    rating: 4.5,
    reviews: 76,
    inStock: true,
  },
  {
    id: "taro-cloud",
    name: "Taro Cloud Latte",
    category: "Bubble Tea",
    price: 2.75,
    image:
      "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=1200&q=80",
    short: "Silky purple taro over cold milk with a foam cloud on top.",
    description:
      "Steamed purple taro root blended with fresh milk and finished with a salted milk-foam cloud. Nutty, sweet and iconic.",
    tags: ["taro", "creamy"],
    rating: 4.6,
    reviews: 118,
    inStock: true,
  },
  {
    id: "chocolate-sundae",
    name: "Choco Storm Sundae",
    category: "Ice Cream",
    price: 2.75,
    image:
      "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=1200&q=80",
    short: "Soft-serve, dark chocolate sauce and crunchy cocoa pearls.",
    description:
      "Creamy soft-serve smothered in warm dark chocolate sauce and topped with crispy cocoa pearls. For the chocolate purists.",
    tags: ["chocolate", "sweet"],
    rating: 4.7,
    reviews: 156,
    inStock: true,
  },
  {
    id: "peach-oolong",
    name: "Peach Oolong Tea",
    category: "Fruit Tea",
    price: 2.5,
    image:
      "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?auto=format&fit=crop&w=1200&q=80",
    short: "Roasted oolong shaken with fresh peach and honey.",
    description:
      "Toasty oolong tea cold-shaken with fresh peach slices and a touch of local honey. Floral, delicate and elegant.",
    tags: ["floral", "fruity"],
    isNew: true,
    rating: 4.7,
    reviews: 88,
    inStock: true,
  },
  {
    id: "coconut-shake",
    name: "Coconut Cream Shake",
    category: "Smoothie",
    price: 2.75,
    image:
      "https://images.unsplash.com/photo-1502741224143-90386d7f8c82?auto=format&fit=crop&w=1200&q=80",
    short: "Young coconut, coconut ice cream and a hint of lime.",
    description:
      "Young Cambodian coconut flesh blended with coconut ice cream and a squeeze of lime. Beach vibes in a cup.",
    tags: ["tropical", "creamy"],
    rating: 4.6,
    reviews: 61,
    inStock: false,
  },
];

export const productCategories = [
  "All",
  "Ice Cream",
  "Bubble Tea",
  "Fruit Tea",
  "Coffee",
  "Smoothie",
] as const;
