import React, { useState } from "react"
import { Link } from "wouter"
import { Heart, ShoppingBag } from "lucide-react"
import { Product } from "@/lib/dummy-data"
import { useWishlist } from "@/store/wishlist"
import { useCart } from "@/store/cart"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { toggleItem, isInWishlist } = useWishlist()
  const { addItem } = useCart()
  const [isHovered, setIsHovered] = useState(false)
  const isWishlisted = isInWishlist(product.id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      productId: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      image: product.images[0],
      size: product.sizes[0], // Default to first size on quick add
      color: product.colors[0],
      quantity: 1
    })
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleItem(product.id)
  }

  const discount = product.salePrice 
    ? Math.round(((product.price - product.salePrice) / product.price) * 100) 
    : 0

  return (
    <Link href={`/product/${product.slug}`} className="group flex flex-col cursor-pointer">
      <div 
        className="relative aspect-[3/4] overflow-hidden bg-secondary mb-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && <Badge variant="default">New</Badge>}
          {product.salePrice && <Badge variant="sale">-{discount}%</Badge>}
          {product.stock === 0 && <Badge variant="destructive">Sold Out</Badge>}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button 
            onClick={handleWishlist}
            className="p-2 bg-background/90 backdrop-blur hover:bg-background rounded-full transition-colors text-foreground"
            aria-label="Toggle wishlist"
          >
            <Heart size={18} className={isWishlisted ? "fill-primary text-primary" : ""} />
          </button>
        </div>

        {/* Quick Add (Desktop Hover) */}
        <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out opacity-0 group-hover:opacity-100">
          <Button 
            className="w-full bg-background/90 backdrop-blur text-foreground hover:bg-foreground hover:text-background"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? "Out of Stock" : "Quick Add"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col flex-grow">
        <h3 className="text-sm font-medium text-foreground tracking-wide uppercase line-clamp-1">{product.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          {product.salePrice ? (
            <>
              <span className="font-serif text-lg text-primary">Rs. {product.salePrice.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground line-through">Rs. {product.price.toLocaleString()}</span>
            </>
          ) : (
            <span className="font-serif text-lg">Rs. {product.price.toLocaleString()}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
