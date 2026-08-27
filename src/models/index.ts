import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "customer", enum: ["customer", "admin"] },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    image: String,
    parentId: { type: Schema.Types.ObjectId, ref: "Category", default: null },
  },
  { timestamps: true }
);

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    salePrice: { type: Number, default: null },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
    stock: { type: Number, default: 0 },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
    material: String,
    careInstructions: String,
    sizes: [String],
    colors: [
      {
        name: String,
        hex: String,
      },
    ],
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isFlashSale: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const ReviewSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const OrderItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  size: String,
  color: String,
});

const OrderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "confirmed", "processing", "packed", "shipped", "delivered", "cancelled", "exchange"],
    },
    total: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    couponId: { type: Schema.Types.ObjectId, ref: "Coupon" },
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: String, default: "pending" },
    shippingAddress: {
      firstName: String,
      lastName: String,
      address: String,
      city: String,
      email: String,
      phone: String,
    },
    items: [OrderItemSchema],
  },
  { timestamps: true }
);

const CouponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    discountType: { type: String, required: true, enum: ["percentage", "fixed"] },
    discountValue: { type: Number, required: true },
    minOrderAmount: { type: Number, default: 0 },
    expiryDate: Date,
    usageLimit: Number,
    usageCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const BannerSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    image: { type: String, required: true },
    cta: String,
    link: String,
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    excerpt: String,
    image: String,
    category: String,
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const SettingSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    value: Schema.Types.Mixed,
  },
  { timestamps: true }
);

export const User = models.User || model("User", UserSchema);
export const Category = models.Category || model("Category", CategorySchema);
export const Product = models.Product || model("Product", ProductSchema);
export const Review = models.Review || model("Review", ReviewSchema);
export const Order = models.Order || model("Order", OrderSchema);
export const Coupon = models.Coupon || model("Coupon", CouponSchema);
export const Banner = models.Banner || model("Banner", BannerSchema);
export const Blog = models.Blog || model("Blog", BlogSchema);
const CartSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    size: String,
    color: String,
  },
  { timestamps: true }
);

const WishlistSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  },
  { timestamps: true }
);

export const Cart = models.Cart || model("Cart", CartSchema);
export const Wishlist = models.Wishlist || model("Wishlist", WishlistSchema);
export const Setting = models.Setting || model("Setting", SettingSchema);
