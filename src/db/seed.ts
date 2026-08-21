import { db } from "./index";
import { categories, products, reviews, users } from "./schema";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("Seeding started...");

  // Clear existing data
  await db.delete(reviews);
  await db.delete(products);
  await db.delete(categories);
  await db.delete(users);

  const hashedPassword = await bcrypt.hash("password123", 10);
  const testUser = await db.insert(users).values({
    name: "Test Customer",
    email: "customer@example.com",
    password: hashedPassword,
    role: "customer",
  }).returning();

  await db.insert(users).values({
    name: "Admin User",
    email: "admin@elegance.pk",
    password: hashedPassword,
    role: "admin",
  });

  const customerId = testUser[0].id;

  const fashionCategory = await db
    .insert(categories)
    .values([
      { name: "Western Wear", slug: "western-wear", description: "Modern western styles" },
      { name: "Undergarments", slug: "undergarments", description: "Premium intimates" },
      { name: "Accessories", slug: "accessories", description: "Complete your look" },
      { name: "New Arrivals", slug: "new-arrivals", description: "Latest fashion trends" },
    ])
    .returning();

  const westernId = fashionCategory.find((c) => c.slug === "western-wear")?.id;
  const undergarmentsId = fashionCategory.find((c) => c.slug === "undergarments")?.id;

  const productData = [];

  // Western Wear
  for (let i = 1; i <= 20; i++) {
    productData.push({
      name: `Premium Western Outfit ${i}`,
      slug: `premium-western-outfit-${i}`,
      description: "A luxury western outfit perfect for any occasion. Made with high-quality fabrics and modern cuts.",
      price: (Math.random() * 5000 + 2000).toFixed(2),
      salePrice: i % 3 === 0 ? (Math.random() * 2000 + 1000).toFixed(2) : null,
      images: [
        { url: `https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop`, publicId: `p${i}a` },
        { url: `https://images.unsplash.com/photo-1539109132374-348218a1f2ad?q=80&w=800&auto=format&fit=crop`, publicId: `p${i}b` },
        { url: `https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800&auto=format&fit=crop`, publicId: `p${i}c` },
      ],
      stock: Math.floor(Math.random() * 50),
      categoryId: westernId,
      material: "100% Cotton",
      careInstructions: "Machine wash cold, tumble dry low.",
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: [
        { name: "Black", hex: "#000000" },
        { name: "White", hex: "#FFFFFF" },
        { name: "Beige", hex: "#F5F5DC" },
      ],
      isFeatured: i <= 4,
      isNewArrival: i > 15,
      isBestSeller: i > 5 && i <= 10,
      isFlashSale: i === 1,
      rating: (Math.random() * 2 + 3).toFixed(1),
      reviewCount: 2,
    });
  }

  // Undergarments
  for (let i = 1; i <= 20; i++) {
    productData.push({
      name: `Luxury Intimates ${i}`,
      slug: `luxury-intimates-${i}`,
      description: "Comfortable and stylish undergarments designed for everyday wear with a touch of luxury.",
      price: (Math.random() * 3000 + 1000).toFixed(2),
      salePrice: i % 4 === 0 ? (Math.random() * 1000 + 500).toFixed(2) : null,
      images: [
        { url: `https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?q=80&w=800&auto=format&fit=crop`, publicId: `u${i}a` },
        { url: `https://images.unsplash.com/photo-1616422285623-13ff0162193c?q=80&w=800&auto=format&fit=crop`, publicId: `u${i}b` },
        { url: `https://images.unsplash.com/photo-1590559899731-a382839e5549?q=80&w=800&auto=format&fit=crop`, publicId: `u${i}c` },
      ],
      stock: Math.floor(Math.random() * 30),
      categoryId: undergarmentsId,
      material: "Silk & Lace",
      careInstructions: "Hand wash only.",
      sizes: ["S", "M", "L"],
      colors: [
        { name: "Red", hex: "#FF0000" },
        { name: "Pink", hex: "#FFC0CB" },
        { name: "Black", hex: "#000000" },
      ],
      isFeatured: i <= 2,
      isNewArrival: i > 18,
      isBestSeller: i > 10 && i <= 15,
      rating: (Math.random() * 2 + 3).toFixed(1),
      reviewCount: 2,
    });
  }

  const insertedProducts = await db.insert(products).values(productData as any).returning();

  // Reviews
  for (const product of insertedProducts) {
    await db.insert(reviews).values([
      {
        productId: product.id,
        userId: customerId,
        userName: "Sara Khan",
        rating: 5,
        comment: "Absolutely love the quality and fit! Highly recommend.",
        isApproved: true,
      },
      {
        productId: product.id,
        userId: customerId,
        userName: "Ayesha Ahmed",
        rating: 4,
        comment: "Very nice fabric, though the delivery took a bit longer than expected.",
        isApproved: true,
      },
    ]);
  }

  console.log("Seeding finished!");
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
