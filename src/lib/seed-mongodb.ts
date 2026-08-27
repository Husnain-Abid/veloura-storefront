import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User, Product, Category, Review } from "../models";
import dbConnect from "./mongodb";


const MONGODB_URI = process.env.MONGODB_URI;

async function seed() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI is not defined");
    process.exit(1);
  }

  await dbConnect();
  console.log("Connected to MongoDB for seeding...");

  // Clear existing data
  await User.deleteMany({});
  await Product.deleteMany({});
  await Category.deleteMany({});
  await Review.deleteMany({});

  const hashedPassword = await bcrypt.hash("password123", 10);
  
  const customer = await User.create({
    name: "Test Customer",
    email: "customer@example.com",
    password: hashedPassword,
    role: "customer",
  });

  const admin = await User.create({
    name: "Admin User",
    email: "admin@elegance.pk",
    password: hashedPassword,
    role: "admin",
  });

  const categories = await Category.insertMany([
    { name: "Western Wear", slug: "western-wear", description: "Modern western styles" },
    { name: "Undergarments", slug: "undergarments", description: "Premium intimates" },
    { name: "Accessories", slug: "accessories", description: "Complete your look" },
    { name: "New Arrivals", slug: "new-arrivals", description: "Latest fashion trends" },
  ]);

  const westernId = categories.find((c: any) => c.slug === "western-wear")._id;
  const undergarmentsId = categories.find((c: any) => c.slug === "undergarments")._id;

  const productData = [];

  // Western Wear
  for (let i = 1; i <= 20; i++) {
    productData.push({
      name: `Premium Western Outfit ${i}`,
      slug: `premium-western-outfit-${i}`,
      description: "A luxury western outfit perfect for any occasion. Made with high-quality fabrics and modern cuts.",
      price: Math.floor(Math.random() * 5000 + 2000),
      salePrice: i % 3 === 0 ? Math.floor(Math.random() * 2000 + 1000) : null,
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
      rating: 4.5,
      reviewCount: 2,
    });
  }

  // Undergarments
  for (let i = 1; i <= 20; i++) {
    productData.push({
      name: `Luxury Intimates ${i}`,
      slug: `luxury-intimates-${i}`,
      description: "Comfortable and stylish undergarments designed for everyday wear with a touch of luxury.",
      price: Math.floor(Math.random() * 3000 + 1000),
      salePrice: i % 4 === 0 ? Math.floor(Math.random() * 1000 + 500) : null,
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
      rating: 4.2,
      reviewCount: 2,
    });
  }

  const products = await Product.insertMany(productData);

  // Reviews
  for (const product of products) {
    await Review.create({
      productId: product._id,
      userId: customer._id,
      userName: "Sara Khan",
      rating: 5,
      comment: "Absolutely love the quality and fit! Highly recommend.",
      isApproved: true,
    });
    await Review.create({
      productId: product._id,
      userId: customer._id,
      userName: "Ayesha Ahmed",
      rating: 4,
      comment: "Very nice fabric, though the delivery took a bit longer than expected.",
      isApproved: true,
    });
  }

  console.log("Seeding finished!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
