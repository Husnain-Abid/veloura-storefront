export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number;
  description: string;
  category: string;
  colors: string[];
  sizes: string[];
  images: string[];
  stock: number;
  rating: number;
  reviewsCount: number;
  material: string;
  careInstructions: string;
  isNew?: boolean;
  isBestSeller?: boolean;
}

export const DUMMY_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "The Sweet Breeze Floral Maxi",
    slug: "sweet-breeze-floral-maxi",
    price: 8500,
    salePrice: 6500,
    description: "Embrace the season with this stunning floral maxi dress. Featuring a flattering V-neckline, gentle ruched detailing, and a flowing skirt that moves beautifully as you walk. Perfect for garden parties or evening soirees.",
    category: "Dresses",
    colors: ["Pink", "Cream", "Sage"],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1612336307429-8a898d10e223?q=80&w=800&auto=format&fit=crop"
    ],
    stock: 12,
    rating: 4.8,
    reviewsCount: 124,
    material: "100% Chiffon with Silk lining",
    careInstructions: "Dry clean only. Do not bleach. Iron on low heat.",
    isNew: true,
    isBestSeller: true
  },
  {
    id: "p2",
    name: "Midnight Noir Silk Slip",
    slug: "midnight-noir-silk-slip",
    price: 12000,
    description: "A masterclass in minimalist elegance. This bias-cut silk slip dress drapes effortlessly over the silhouette. Delicate spaghetti straps and a subtle cowl neck create a timeless evening look.",
    category: "Dresses",
    colors: ["Black", "Navy", "Emerald"],
    sizes: ["S", "M", "L"],
    images: [
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800&auto=format&fit=crop"
    ],
    stock: 5,
    rating: 4.9,
    reviewsCount: 89,
    material: "100% Mulberry Silk",
    careInstructions: "Hand wash cold. Lay flat to dry.",
    isBestSeller: true
  },
  {
    id: "p3",
    name: "Ivory Pleated Trousers",
    slug: "ivory-pleated-trousers",
    price: 6800,
    description: "Tailored to perfection, these high-waisted pleated trousers offer a relaxed yet structured fit. Pair with a crisp blouse for office elegance or a simple tee for weekend chic.",
    category: "Bottoms",
    colors: ["Ivory", "Camel", "Black"],
    sizes: ["XS", "S", "M", "L"],
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?q=80&w=800&auto=format&fit=crop"
    ],
    stock: 20,
    rating: 4.5,
    reviewsCount: 56,
    material: "Crepe de Chine",
    careInstructions: "Machine wash delicate. Line dry.",
  },
  {
    id: "p4",
    name: "Oversized Cashmere Blend Coat",
    slug: "oversized-cashmere-blend-coat",
    price: 18500,
    salePrice: 15000,
    description: "Wrap yourself in luxury. This oversized coat features wide lapels, deep pockets, and a matching belt. The cashmere blend ensures warmth without the bulk.",
    category: "Outerwear",
    colors: ["Camel", "Charcoal", "Cream"],
    sizes: ["S", "M", "L"],
    images: [
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520975954732-57dd22299614?q=80&w=800&auto=format&fit=crop"
    ],
    stock: 8,
    rating: 5.0,
    reviewsCount: 32,
    material: "70% Wool, 30% Cashmere",
    careInstructions: "Dry clean only.",
    isNew: true
  },
  {
    id: "p5",
    name: "Ribbed Knit Turtleneck",
    slug: "ribbed-knit-turtleneck",
    price: 4500,
    description: "An essential layering piece. The tight-rib knit provides a flattering, body-hugging silhouette while remaining breathable and incredibly soft.",
    category: "Tops",
    colors: ["White", "Black", "Burgundy", "Olive"],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop"
    ],
    stock: 45,
    rating: 4.6,
    reviewsCount: 210,
    material: "Cotton Blend",
    careInstructions: "Machine wash cold. Tumble dry low.",
  },
  {
    id: "p6",
    name: "Draped Satin Blouse",
    slug: "draped-satin-blouse",
    price: 5200,
    salePrice: 4000,
    description: "Elevate your evening wear with this luxurious draped satin blouse. Features a subtle sheen, blouson sleeves, and a delicate tie at the waist.",
    category: "Tops",
    colors: ["Champagne", "Rose", "Black"],
    sizes: ["S", "M", "L"],
    images: [
      "https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1434389678369-184bf342d057?q=80&w=800&auto=format&fit=crop"
    ],
    stock: 15,
    rating: 4.3,
    reviewsCount: 45,
    material: "Polyester Satin",
    careInstructions: "Hand wash cold. Do not wring.",
  },
  {
    id: "p7",
    name: "Structured Denim Midi Skirt",
    slug: "structured-denim-midi-skirt",
    price: 5800,
    description: "A modern take on a classic. This structured denim midi features a front slit, high waist, and classic five-pocket styling in a vintage wash.",
    category: "Bottoms",
    colors: ["Vintage Blue", "Washed Black"],
    sizes: ["XS", "S", "M", "L"],
    images: [
      "https://images.unsplash.com/photo-1551489186-ccb95a1ea6a3?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582552938357-32b906df40cb?q=80&w=800&auto=format&fit=crop"
    ],
    stock: 22,
    rating: 4.7,
    reviewsCount: 67,
    material: "100% Cotton Denim",
    careInstructions: "Machine wash cold inside out.",
    isNew: true
  },
  {
    id: "p8",
    name: "Velvet Wrap Dress",
    slug: "velvet-wrap-dress",
    price: 9500,
    description: "Rich, crushed velvet meets a classic wrap silhouette. Features a deep V-neck and a high-low hemline that adds drama to every step.",
    category: "Dresses",
    colors: ["Deep Red", "Forest Green", "Navy"],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566206091558-f6268948ee9d?q=80&w=800&auto=format&fit=crop"
    ],
    stock: 0,
    rating: 4.8,
    reviewsCount: 112,
    material: "Silk Velvet Blend",
    careInstructions: "Dry clean only.",
    isBestSeller: true
  },
  {
    id: "p9",
    name: "Linen Resort Shirt",
    slug: "linen-resort-shirt",
    price: 4200,
    description: "Breezy and light. This pure linen shirt is perfect for warm days. Features a relaxed collar, dropped shoulders, and shell buttons.",
    category: "Tops",
    colors: ["White", "Sand", "Light Blue"],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1596455607563-ad6193f76b17?q=80&w=800&auto=format&fit=crop"
    ],
    stock: 30,
    rating: 4.4,
    reviewsCount: 88,
    material: "100% European Linen",
    careInstructions: "Machine wash cold. Line dry in shade.",
  },
  {
    id: "p10",
    name: "Faux Leather Trench",
    slug: "faux-leather-trench",
    price: 14000,
    salePrice: 11500,
    description: "Command attention in this sleek faux leather trench coat. With storm flaps, an adjustable belt, and a deep back vent, it’s the ultimate statement outerwear.",
    category: "Outerwear",
    colors: ["Black", "Chocolate"],
    sizes: ["S", "M", "L"],
    images: [
      "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=800&auto=format&fit=crop"
    ],
    stock: 10,
    rating: 4.9,
    reviewsCount: 41,
    material: "PU Leather",
    careInstructions: "Wipe clean with a damp cloth.",
    isNew: true
  },
  {
    id: "p11",
    name: "Asymmetric Knit Dress",
    slug: "asymmetric-knit-dress",
    price: 7500,
    description: "Contemporary lines meet comfort. This fine-knit dress features a striking asymmetric hem and a single-shoulder cutout design.",
    category: "Dresses",
    colors: ["Charcoal", "Muted Olive"],
    sizes: ["XS", "S", "M", "L"],
    images: [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515347619152-16b713b190df?q=80&w=800&auto=format&fit=crop"
    ],
    stock: 18,
    rating: 4.5,
    reviewsCount: 39,
    material: "Viscose Blend",
    careInstructions: "Hand wash cold. Dry flat.",
  },
  {
    id: "p12",
    name: "Wide-Leg Culottes",
    slug: "wide-leg-culottes",
    price: 4900,
    salePrice: 3500,
    description: "Effortlessly chic. These wide-leg culottes offer the movement of a skirt with the practicality of trousers. Features a discrete side zip.",
    category: "Bottoms",
    colors: ["Rust", "Navy", "Cream"],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1475179532800-4b16af117f72?q=80&w=800&auto=format&fit=crop"
    ],
    stock: 25,
    rating: 4.2,
    reviewsCount: 61,
    material: "Cotton Poplin",
    careInstructions: "Machine wash warm. Iron while damp.",
  }
];

export const CATEGORIES = ["All", "Dresses", "Tops", "Bottoms", "Outerwear"];
