import { useEffect, useMemo, useState } from "react";
import { Link, Route, Router as WouterRouter, Switch, useLocation } from "wouter";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  // Facebook,
  Heart,
  // Instagram,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  X,
} from "lucide-react";
import { DUMMY_PRODUCTS, CATEGORIES, type Product } from "@/lib/dummy-data";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";

const money = (value: number) => `Rs. ${value.toLocaleString("en-PK")}`;
const heroImage =
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1800&q=85";
const editorialImage =
  "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1200&q=85";
const journalImage =
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1100&q=85";

function useQuery() {
  const [location] = useLocation();
  return new URLSearchParams(location.split("?")[1] || "");
}

function useToast() {
  const [toast, setToast] = useState("");
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);
  return { toast, showToast: setToast };
}

function Header({ onSearch }: { onSearch: (value: string) => void }) {
  const [location, setLocation] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const cartItems = useCart((state) => state.items);
  const setCartOpen = useCart((state) => state.setIsOpen);
  const wishlistCount = useWishlist((state) => state.items.length);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (search.trim()) {
      onSearch(search.trim());
      setLocation(`/shop?search=${encodeURIComponent(search.trim())}`);
      setSearchOpen(false);
    }
  };

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location]);

  return (
    <>
      <div className="announcement">Complimentary delivery on orders above Rs. 5,000 <span>·</span> New season, now arriving</div>
      <header className="site-header">
        <div className="header-main shell">
          <button className="icon-button mobile-only" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu size={20} /></button>
          <nav className="desktop-nav">
            <Link href="/shop">Shop</Link>
            <Link href="/shop?new=true">New in</Link>
            <Link href="/shop?category=Dresses">Dresses</Link>
            <Link href="/journal">Journal</Link>
          </nav>
          <Link href="/" className="wordmark">VELOURA<span>®</span></Link>
          <div className="header-actions">
            <button className="icon-button" onClick={() => setSearchOpen((open) => !open)} aria-label="Search"><Search size={19} /></button>
            <Link className="icon-button account-action" href="/account" aria-label="Account"><CircleUserRound size={19} /></Link>
            <Link className="icon-button" href="/wishlist" aria-label="Wishlist"><Heart size={19} /><Count value={wishlistCount} /></Link>
            <button className="icon-button" onClick={() => setCartOpen(true)} aria-label="Open cart"><ShoppingBag size={19} /><Count value={cartCount} /></button>
          </div>
        </div>
        <nav className="category-nav shell">
          {CATEGORIES.filter((category) => category !== "All").map((category) => <Link key={category} href={`/shop?category=${category}`}>{category}</Link>)}
          <Link href="/shop?category=Accessories">Accessories</Link>
          <Link href="/shop?sale=true" className="sale-link">The edit / sale</Link>
        </nav>
        {searchOpen && (
          <div className="search-panel">
            <form className="search-form shell" onSubmit={submitSearch}>
              <Search size={21} />
              <input autoFocus value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search dresses, tailoring, silk..." />
              <button type="button" className="icon-button" onClick={() => setSearchOpen(false)} aria-label="Close search"><X size={20} /></button>
            </form>
            <div className="search-suggestions shell">
              <span>Trending now</span>
              <button onClick={() => { setSearch("linen"); onSearch("linen"); setLocation("/shop?search=linen"); setSearchOpen(false); }}>Linen edit</button>
              <button onClick={() => { setSearch("dress"); onSearch("dress"); setLocation("/shop?search=dress"); setSearchOpen(false); }}>Occasion dresses</button>
              <button onClick={() => { setSearch("outerwear"); onSearch("outerwear"); setLocation("/shop?search=outerwear"); setSearchOpen(false); }}>Modern outerwear</button>
            </div>
          </div>
        )}
      </header>
      {menuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMenuOpen(false)}>
          <aside className="mobile-menu" onClick={(event) => event.stopPropagation()}>
            <div className="mobile-menu-top"><span className="wordmark">VELOURA<span>®</span></span><button className="icon-button" onClick={() => setMenuOpen(false)}><X size={20} /></button></div>
            <p className="eyebrow">Explore the collection</p>
            <Link href="/shop">Shop all <ArrowRight size={16} /></Link>
            <Link href="/shop?new=true">New arrivals <ArrowRight size={16} /></Link>
            {CATEGORIES.filter((category) => category !== "All").map((category) => <Link key={category} href={`/shop?category=${category}`}>{category} <ArrowRight size={16} /></Link>)}
            <div className="mobile-menu-divider" />
            <Link href="/about">Our story <ArrowRight size={16} /></Link>
            <Link href="/contact">Contact <ArrowRight size={16} /></Link>
            <Link href="/account">Account <ArrowRight size={16} /></Link>
          </aside>
        </div>
      )}
    </>
  );
}

function Count({ value }: { value: number }) {
  return value ? <span className="count">{value}</span> : null;
}

function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer-top">
        {/* <div className="footer-brand"><div className="wordmark footer-wordmark">VELOURA<span>®</span></div><p>Expressive silhouettes, considered details, and a wardrobe built to stay with you.</p><div className="socials"><Instagram size={17} /><Facebook size={17} /><span className="social-text">Pinterest</span></div></div> */}
        {/* <div><h4>Explore</h4><Link href="/shop">Shop all</Link><Link href="/shop?new=true">New arrivals</Link><Link href="/shop?category=Dresses">Dresses</Link><Link href="/journal">The journal</Link></div> */}
        <div><h4>Service</h4><Link href="/contact">Contact us</Link><Link href="/faq">FAQ</Link><Link href="/size-guide">Size guide</Link><Link href="/policies">Shipping & returns</Link></div>
        <div className="footer-newsletter"><h4>Stay in the know</h4><p>Receive first access to new collections and private edits.</p><form onSubmit={(event) => event.preventDefault()}><input type="email" placeholder="Email address" aria-label="Email address" /><button type="submit">Join</button></form></div>
      </div>
      <div className="shell footer-bottom"><span>© 2026 Veloura Studio. All rights reserved.</span><div><Link href="/policies">Privacy</Link><Link href="/policies">Terms</Link><span>PKR / Pakistan</span></div></div>
    </footer>
  );
}

function ProductCard({ product, onToast }: { product: Product; onToast: (message: string) => void }) {
  const [hovered, setHovered] = useState(false);
  const toggleWishlist = useWishlist((state) => state.toggleItem);
  const isWishlisted = useWishlist((state) => state.items.includes(product.id));
  const addItem = useCart((state) => state.addItem);
  const discount = product.salePrice ? Math.round((1 - product.salePrice / product.price) * 100) : 0;
  const quickAdd = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!product.stock) return;
    addItem({ productId: product.id, name: product.name, price: product.salePrice || product.price, image: product.images[0], size: product.sizes[0], color: product.colors[0], quantity: 1 });
    onToast("Added to your bag");
  };
  return (
    <Link href={`/product/${product.slug}`} className="product-card" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="product-image-wrap">
        <img src={hovered && product.images[1] ? product.images[1] : product.images[0]} alt={product.name} className="product-image" loading="lazy" />
        <div className="product-tags">{product.isNew && <span>New</span>}{discount > 0 && <span>−{discount}%</span>}{!product.stock && <span>Sold out</span>}</div>
        <button className={`wishlist-button ${isWishlisted ? "is-loved" : ""}`} onClick={(event) => { event.preventDefault(); event.stopPropagation(); toggleWishlist(product.id); onToast(isWishlisted ? "Removed from wishlist" : "Saved to wishlist"); }} aria-label="Save product"><Heart size={17} fill={isWishlisted ? "currentColor" : "none"} /></button>
        <div className="quick-add"><button disabled={!product.stock} onClick={quickAdd}>{product.stock ? "Quick add" : "Out of stock"} <Plus size={15} /></button></div>
      </div>
      <div className="product-meta"><div><h3>{product.name}</h3><p>{product.category} · {product.colors[0]}</p></div><div className="product-price">{product.salePrice ? <><strong>{money(product.salePrice)}</strong><del>{money(product.price)}</del></> : <strong>{money(product.price)}</strong>}</div></div>
    </Link>
  );
}

function Toast({ message }: { message: string }) {
  return message ? <div className="toast"><Check size={16} />{message}</div> : null;
}

function CartDrawer() {
  const items = useCart((state) => state.items);
  const isOpen = useCart((state) => state.isOpen);
  const setIsOpen = useCart((state) => state.setIsOpen);
  const removeItem = useCart((state) => state.removeItem);
  const updateQuantity = useCart((state) => state.updateQuantity);
  const totals = useCart((state) => state.getTotals)();
  if (!isOpen) return null;
  return <div className="drawer-overlay" onClick={() => setIsOpen(false)}><aside className="cart-drawer" onClick={(event) => event.stopPropagation()}>
    <div className="drawer-heading"><div><span className="eyebrow">Your selection</span><h2>Shopping bag <small>({items.length})</small></h2></div><button className="icon-button" onClick={() => setIsOpen(false)} aria-label="Close cart"><X size={20} /></button></div>
    {items.length === 0 ? <div className="empty-drawer"><ShoppingBag size={38} strokeWidth={1} /><h3>Your bag is waiting</h3><p>Discover something considered for your next chapter.</p><Link href="/shop" onClick={() => setIsOpen(false)} className="button button-dark">Shop the edit</Link></div> : <>
      <div className="drawer-items">{items.map((item) => <div className="drawer-item" key={item.id}><img src={item.image} alt={item.name} /><div className="drawer-item-copy"><Link href={`/product/${item.productId}`} onClick={() => setIsOpen(false)}>{item.name}</Link><span>{item.color} / {item.size}</span><div className="drawer-item-bottom"><div className="quantity-control"><button onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={12} /></button><span>{item.quantity}</span><button onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={12} /></button></div><strong>{money(item.price * item.quantity)}</strong></div><button className="remove-link" onClick={() => removeItem(item.id)}>Remove</button></div></div>)}</div>
      <div className="drawer-summary"><div className="shipping-note">{totals.subtotal >= 5000 ? <><Check size={15} /> You qualify for complimentary delivery</> : <>Add {money(5000 - totals.subtotal)} for complimentary delivery</>}</div><div className="summary-row"><span>Subtotal</span><strong>{money(totals.subtotal)}</strong></div><div className="summary-row total"><span>Total</span><strong>{money(totals.total)}</strong></div><Link href="/checkout" onClick={() => setIsOpen(false)} className="button button-dark full-button">Proceed to checkout <ArrowRight size={16} /></Link><Link href="/cart" onClick={() => setIsOpen(false)} className="view-cart-link">View bag</Link></div>
    </>}
  </aside></div>;
}

function HomePage({ onToast }: { onToast: (message: string) => void }) {
  const newArrivals = DUMMY_PRODUCTS.filter((product) => product.isNew).slice(0, 4);
  const bestSellers = DUMMY_PRODUCTS.filter((product) => product.isBestSeller).slice(0, 4);
  return <div className="page">
    <section className="hero">
      <img src={heroImage} alt="Woman wearing a flowing cream dress" />
      <div className="hero-shade" />
      <div className="hero-copy"><p className="eyebrow light">The new season / 01</p><h1>Dress for<br /><em>the feeling.</em></h1><p>Quietly expressive pieces for everywhere you are going.</p><Link href="/shop?new=true" className="button button-light">Discover the collection <ArrowRight size={16} /></Link></div>
      <div className="hero-caption"><span>01</span><span className="hero-line" /><span>04</span></div>
    </section>
    <section className="manifesto shell"><p className="eyebrow">A considered wardrobe</p><h2>Clothes with a point<br /><em>of view.</em></h2><p className="manifesto-copy">We believe the most memorable pieces are the ones that become part of your story. Veloura makes modern clothing with a little more feeling, made to be worn your way.</p><Link href="/about" className="text-link">More about Veloura <ArrowRight size={15} /></Link></section>
    <section className="split-editorial shell"><div className="editorial-image"><img src={editorialImage} alt="Editorial Veloura collection" /></div><div className="editorial-copy"><p className="eyebrow">The soft structure edit</p><h2>Shape, <em>softened.</em></h2><p>Fluid tailoring, tactile layers and a palette that lets you do the most with the least.</p><Link href="/shop?category=Outerwear" className="text-link">Shop outerwear <ArrowRight size={15} /></Link></div></section>
    <section className="product-section shell"><div className="section-heading"><div><p className="eyebrow">Just landed</p><h2>New arrivals</h2></div><Link href="/shop?new=true" className="text-link">View all <ArrowRight size={15} /></Link></div><div className="product-grid four">{newArrivals.map((product) => <ProductCard key={product.id} product={product} onToast={onToast} />)}</div></section>
    <section className="campaign-banner"><img src={journalImage} alt="Veloura campaign" /><div><p className="eyebrow light">A study in everyday</p><h2>The art of<br /><em>being seen.</em></h2><Link href="/journal" className="button button-light">Read the journal <ArrowRight size={16} /></Link></div></section>
    <section className="product-section shell"><div className="section-heading"><div><p className="eyebrow">The signatures</p><h2>Most loved</h2></div><Link href="/shop" className="text-link">Shop best sellers <ArrowRight size={15} /></Link></div><div className="product-grid four">{bestSellers.map((product) => <ProductCard key={product.id} product={product} onToast={onToast} />)}</div></section>
    <section className="category-strip shell"><Link href="/shop?category=Dresses"><span>Dresses</span><img src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=700&q=80" alt="Dresses" /><ArrowRight /></Link><Link href="/shop?category=Tops"><span>Tops</span><img src="https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?auto=format&fit=crop&w=700&q=80" alt="Tops" /><ArrowRight /></Link><Link href="/shop?category=Bottoms"><span>Bottoms</span><img src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=700&q=80" alt="Bottoms" /><ArrowRight /></Link></section>
    <section className="newsletter-section"><div className="newsletter-inner"><Sparkles size={22} /><p className="eyebrow">The Veloura letter</p><h2>A little more<br /><em>inspiration.</em></h2><p>New collections, studio notes and a considered edit, sent occasionally.</p><form onSubmit={(event) => { event.preventDefault(); onToast("Welcome to the Veloura letter"); }}><input type="email" placeholder="Your email address" required /><button type="submit">Sign me up <ArrowRight size={15} /></button></form></div></section>
  </div>;
}

function ShopPage({ onToast }: { onToast: (message: string) => void }) {
  const query = useQuery();
  const [category, setCategory] = useState(query.get("category") || "All");
  const [search, setSearch] = useState(query.get("search") || "");
  const [sort, setSort] = useState("featured");
  const [filterOpen, setFilterOpen] = useState(false);
  const [priceFilter, setPriceFilter] = useState("all");
  const filtered = useMemo(() => {
    let list = DUMMY_PRODUCTS.filter((product) => category === "All" || product.category === category);
    if (query.get("new") === "true") list = list.filter((product) => product.isNew);
    if (query.get("sale") === "true") list = list.filter((product) => product.salePrice);
    if (search) list = list.filter((product) => `${product.name} ${product.category} ${product.colors.join(" ")}`.toLowerCase().includes(search.toLowerCase()));
    if (priceFilter === "under5000") list = list.filter((product) => (product.salePrice || product.price) < 5000);
    if (priceFilter === "over10000") list = list.filter((product) => (product.salePrice || product.price) > 10000);
    if (sort === "low") list.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    if (sort === "high") list.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    return list;
  }, [category, priceFilter, query, search, sort]);
  return <div className="page shop-page shell"><div className="breadcrumbs"><Link href="/">Home</Link><ChevronRight size={13} /><span>Shop</span></div><div className="shop-intro"><p className="eyebrow">{search ? `Search results for “${search}”` : "The collection"}</p><h1>All pieces</h1><p>Considered silhouettes for the way you live now.</p></div><div className="shop-toolbar"><button className={`filter-toggle ${filterOpen ? "active" : ""}`} onClick={() => setFilterOpen(!filterOpen)}>Filters <span>{filterOpen ? "−" : "+"}</span></button><span className="result-count">{filtered.length} pieces</span><label className="sort-select">Sort by <select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select><ChevronDown size={14} /></label></div>{filterOpen && <div className="filter-panel"><div><span>Category</span><div className="filter-options">{CATEGORIES.map((item) => <button className={category === item ? "selected" : ""} key={item} onClick={() => setCategory(item)}>{item}</button>)}</div></div><div><span>Price</span><div className="filter-options"><button className={priceFilter === "all" ? "selected" : ""} onClick={() => setPriceFilter("all")}>All prices</button><button className={priceFilter === "under5000" ? "selected" : ""} onClick={() => setPriceFilter("under5000")}>Under Rs. 5,000</button><button className={priceFilter === "over10000" ? "selected" : ""} onClick={() => setPriceFilter("over10000")}>Over Rs. 10,000</button></div></div></div>}<div className="category-pills">{CATEGORIES.map((item) => <button key={item} className={category === item ? "selected" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div>{filtered.length ? <div className="product-grid four shop-grid">{filtered.map((product) => <ProductCard key={product.id} product={product} onToast={onToast} />)}</div> : <div className="empty-state"><Search size={28} strokeWidth={1.2} /><h2>No pieces found</h2><p>Try a different search or reset your filters.</p><button className="button button-dark" onClick={() => { setSearch(""); setCategory("All"); setPriceFilter("all"); }}>View all pieces</button></div>}</div>;
}

function ProductPage({ onToast }: { onToast: (message: string) => void }) {
  const [location, setLocation] = useLocation();
  const slug = location.split("/product/")[1]?.split("?")[0];
  const product = DUMMY_PRODUCTS.find((item) => item.slug === slug) || DUMMY_PRODUCTS[0];
  const [imageIndex, setImageIndex] = useState(0);
  const [size, setSize] = useState(product.sizes[0]);
  const [color, setColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const toggleWishlist = useWishlist((state) => state.toggleItem);
  const isWishlisted = useWishlist((state) => state.items.includes(product.id));
  const addItem = useCart((state) => state.addItem);
  const setCartOpen = useCart((state) => state.setIsOpen);
  const addToCart = () => { addItem({ productId: product.id, name: product.name, price: product.salePrice || product.price, image: product.images[0], size, color, quantity }); onToast("Added to your bag"); };
  return <div className="page product-page shell"><div className="breadcrumbs"><Link href="/">Home</Link><ChevronRight size={13} /><Link href="/shop">Shop</Link><ChevronRight size={13} /><span>{product.name}</span></div><div className="product-layout"><div className="product-gallery"><div className="gallery-main"><img src={product.images[imageIndex % product.images.length]} alt={product.name} /></div><div className="gallery-thumbs">{product.images.concat(product.images).slice(0, 4).map((image, index) => <button key={`${image}-${index}`} className={imageIndex === index ? "active" : ""} onClick={() => setImageIndex(index)}><img src={image} alt="" /></button>)}</div></div><div className="product-detail"><p className="eyebrow">{product.category} / Veloura studio</p><h1>{product.name}</h1><div className="rating"><span>{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={13} fill="currentColor" />)}</span> {product.rating} · {product.reviewsCount} reviews</div><div className="detail-price">{product.salePrice ? <><strong>{money(product.salePrice)}</strong><del>{money(product.price)}</del><span>Sale</span></> : <strong>{money(product.price)}</strong>}</div><p className="detail-description">{product.description}</p><div className="option-block"><div className="option-label"><span>Colour: <strong>{color}</strong></span><span>{product.colors.length} shades</span></div><div className="swatches">{product.colors.map((item) => <button key={item} title={item} onClick={() => setColor(item)} className={color === item ? "active" : ""} style={{ background: item.toLowerCase().replace("vintage blue", "#66849a").replace("muted olive", "#8c8d74").replace("deep red", "#752c2c").replace("forest green", "#315243").replace("champagne", "#ead2aa").replace("rose", "#cb8e9a").replace("ivory", "#eee7d7").replace("camel", "#b38a62").replace("cream", "#f1ede4").replace("black", "#171717").replace("white", "#fff").replace("navy", "#222d4d").replace("emerald", "#2b6252").replace("sage", "#aeb8a1").replace("pink", "#df9aa9").replace("charcoal", "#4d4d4d").replace("burgundy", "#5a2936").replace("olive", "#788063").replace("sand", "#d7c4a9").replace("light blue", "#b9cdd6").replace("chocolate", "#593d33").replace("rust", "#a75e42") }} />)}</div></div><div className="option-block"><div className="option-label"><span>Size</span><Link href="/size-guide">Size guide</Link></div><div className="size-options">{product.sizes.map((item) => <button key={item} className={size === item ? "active" : ""} onClick={() => setSize(item)}>{item}</button>)}</div></div><div className="buy-row"><div className="quantity-control large"><button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={13} /></button><span>{quantity}</span><button onClick={() => setQuantity(quantity + 1)}><Plus size={13} /></button></div><button className="button button-dark add-button" onClick={addToCart} disabled={!product.stock}>{product.stock ? "Add to bag" : "Out of stock"} <ShoppingBag size={16} /></button><button className={`save-button ${isWishlisted ? "is-loved" : ""}`} onClick={() => { toggleWishlist(product.id); onToast(isWishlisted ? "Removed from wishlist" : "Saved to wishlist"); }} aria-label="Save to wishlist"><Heart size={19} fill={isWishlisted ? "currentColor" : "none"} /></button></div><button className="buy-now" onClick={() => { addToCart(); setCartOpen(false); setLocation("/checkout"); }}>Buy it now <ArrowRight size={16} /></button><div className="trust-row"><span><Truck size={16} /> Delivery in 3–5 working days</span><span><Check size={16} /> Easy exchange within 7 days</span></div><div className="accordions"><details open><summary>About the piece <Plus size={15} /></summary><p>{product.material}. Designed for a relaxed, effortless fit. Please see our size guide before ordering.</p></details><details><summary>Care instructions <Plus size={15} /></summary><p>{product.careInstructions}</p></details><details><summary>Shipping & exchange <Plus size={15} /></summary><p>Complimentary delivery over Rs. 5,000. Exchange-only policy within seven days of delivery.</p></details></div></div></div><div className="related-section"><p className="eyebrow">You may also like</p><h2>Complete the feeling</h2><div className="product-grid four">{DUMMY_PRODUCTS.filter((item) => item.id !== product.id).slice(0, 4).map((item) => <ProductCard key={item.id} product={item} onToast={onToast} />)}</div></div></div>;
}

function WishlistPage({ onToast }: { onToast: (message: string) => void }) {
  const items = useWishlist((state) => state.items);
  const products = DUMMY_PRODUCTS.filter((product) => items.includes(product.id));
  return <div className="page shell simple-page"><p className="eyebrow">Saved for later</p><h1>Your wishlist</h1><p className="page-lede">Pieces you loved enough to keep close.</p>{products.length ? <div className="product-grid four">{products.map((product) => <ProductCard key={product.id} product={product} onToast={onToast} />)}</div> : <div className="empty-state"><Heart size={30} strokeWidth={1.2} /><h2>Nothing saved yet</h2><p>When a piece catches your eye, tap the heart to find it here.</p><Link href="/shop" className="button button-dark">Explore the collection</Link></div>}</div>;
}

function CartPage() {
  const items = useCart((state) => state.items);
  const removeItem = useCart((state) => state.removeItem);
  const updateQuantity = useCart((state) => state.updateQuantity);
  const totals = useCart((state) => state.getTotals)();
  return <div className="page shell cart-page"><div className="breadcrumbs"><Link href="/">Home</Link><ChevronRight size={13} /><span>Your bag</span></div><div className="cart-heading"><div><p className="eyebrow">Your selection</p><h1>Shopping bag</h1></div><span>{items.reduce((sum, item) => sum + item.quantity, 0)} items</span></div>{items.length ? <div className="cart-layout"><div className="cart-list">{items.map((item) => <div className="cart-line" key={item.id}><img src={item.image} alt={item.name} /><div className="cart-line-copy"><Link href={`/product/${item.productId}`}>{item.name}</Link><span>{item.color} / {item.size}</span><div className="quantity-control"><button onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={12} /></button><span>{item.quantity}</span><button onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={12} /></button></div></div><div className="cart-line-price"><strong>{money(item.price * item.quantity)}</strong><button className="remove-link" onClick={() => removeItem(item.id)}>Remove</button></div></div>)}</div><OrderSummary totals={totals} /></div> : <div className="empty-state"><ShoppingBag size={30} strokeWidth={1.2} /><h2>Your bag is empty</h2><p>Good things take time. Start with the collection.</p><Link href="/shop" className="button button-dark">Shop all pieces</Link></div>}</div>;
}

function OrderSummary({ totals, checkout = false }: { totals: { subtotal: number; shipping: number; total: number }; checkout?: boolean }) {
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  return <aside className="order-summary"><p className="eyebrow">Summary</p><h2>Order total</h2><div className="coupon-row"><input value={coupon} onChange={(event) => setCoupon(event.target.value)} placeholder="Discount code" /><button onClick={() => setCouponApplied(Boolean(coupon))}>Apply</button></div>{couponApplied && <p className="coupon-success"><Check size={13} /> Code applied · QUEEN</p>}<div className="summary-row"><span>Subtotal</span><strong>{money(totals.subtotal)}</strong></div><div className="summary-row"><span>Delivery</span><strong>{totals.shipping ? money(totals.shipping) : "Complimentary"}</strong></div><div className="summary-row total"><span>Total</span><strong>{money(totals.total)}</strong></div>{!checkout && <Link href="/checkout" className="button button-dark full-button">Checkout <ArrowRight size={16} /></Link>}<p className="secure-note"><Check size={14} /> Secure checkout · Easy exchange within 7 days</p></aside>;
}

function CheckoutPage({ onToast }: { onToast: (message: string) => void }) {
  const items = useCart((state) => state.items);
  const totals = useCart((state) => state.getTotals)();
  const clearCart = useCart((state) => state.clearCart);
  const [placed, setPlaced] = useState(false);
  const [payment, setPayment] = useState("card");
  if (placed) return <div className="page shell confirmation"><div className="confirmation-mark"><Check size={28} /></div><p className="eyebrow">Order received</p><h1>Thank you for choosing<br /><em>Veloura.</em></h1><p>Your order is being prepared with care. We’ll send confirmation details to your email shortly.</p><Link href="/shop" className="button button-dark">Continue shopping <ArrowRight size={16} /></Link></div>;
  return <div className="page checkout-page shell"><div className="checkout-header"><Link href="/" className="wordmark">VELOURA<span>®</span></Link><span>Secure checkout</span></div>{!items.length ? <div className="empty-state"><ShoppingBag size={30} strokeWidth={1.2} /><h2>Your bag is empty</h2><Link href="/shop" className="button button-dark">Return to shop</Link></div> : <div className="checkout-layout"><form className="checkout-form" onSubmit={(event) => { event.preventDefault(); clearCart(); setPlaced(true); onToast("Order placed"); }}><div className="checkout-section"><div className="section-title"><span>01</span><h2>Contact</h2></div><input type="email" placeholder="Email address" required /><label className="check-label"><input type="checkbox" defaultChecked /> Email me with news and offers</label></div><div className="checkout-section"><div className="section-title"><span>02</span><h2>Delivery</h2></div><select defaultValue="Pakistan"><option>Pakistan</option><option>United Arab Emirates</option><option>United Kingdom</option></select><div className="form-grid"><input placeholder="First name" required /><input placeholder="Last name" required /></div><input placeholder="Address" required /><div className="form-grid"><input placeholder="City" required /><input placeholder="Postal code" /></div><input placeholder="Phone number" required /><label className="check-label"><input type="checkbox" /> Save this information for next time</label></div><div className="checkout-section"><div className="section-title"><span>03</span><h2>Shipping method</h2></div><label className="radio-card selected"><input type="radio" name="shipping" defaultChecked /> <span>Standard delivery<small>3–5 working days</small></span><strong>{totals.shipping ? money(totals.shipping) : "Free"}</strong></label></div><div className="checkout-section"><div className="section-title"><span>04</span><h2>Payment</h2></div><div className="payment-options">{[["card", "Credit / debit card"], ["cod", "Cash on delivery"], ["bank", "Bank transfer"], ["jazzcash", "JazzCash / Easypaisa"]].map(([value, label]) => <label className={`radio-card ${payment === value ? "selected" : ""}`} key={value}><input type="radio" name="payment" value={value} checked={payment === value} onChange={() => setPayment(value)} /><span>{label}<small>{value === "card" ? "Visa, Mastercard, Apple Pay" : value === "cod" ? "Pay when your order arrives" : "Secure payment option"}</small></span></label>)}</div>{payment === "card" && <div className="card-fields"><input placeholder="Card number" /><div className="form-grid"><input placeholder="Expiration date" /><input placeholder="Security code" /></div><input placeholder="Name on card" /></div>}</div><button className="button button-dark full-button place-order" type="submit">Place order · {money(totals.total)} <ArrowRight size={16} /></button></form><OrderSummary totals={totals} checkout /></div>}</div>;
}

function ContentPage({ type }: { type: "about" | "contact" | "faq" | "policies" | "size-guide" | "journal" | "account" }) {
  const title = { about: "Made to be yours.", contact: "We would love to hear from you.", faq: "Questions, considered.", policies: "The details matter.", "size-guide": "Find your perfect fit.", journal: "The Veloura journal.", account: "Welcome back." }[type];
  const intro = { about: "Veloura is a modern womenswear studio creating expressive, wearable pieces from Lahore to wherever you are.", contact: "Our studio team is here Monday to Saturday, 10am–6pm PKT.", faq: "Everything you need to know before your next Veloura piece arrives.", policies: "Simple, clear information about delivery, exchanges and taking care of your pieces.", "size-guide": "Our pieces are designed with a relaxed, intentional fit. Use the guide below as a starting point.", journal: "Notes on dressing, making, and the art of a considered life.", account: "Sign in to see orders, saved pieces and your personal details." }[type];
  if (type === "account") return <div className="page shell account-page"><div className="account-intro"><p className="eyebrow">The private edit</p><h1>{title}</h1><p>{intro}</p></div><div className="account-card"><h2>Sign in</h2><input type="email" placeholder="Email address" /><input type="password" placeholder="Password" /><button className="button button-dark full-button">Sign in <ArrowRight size={16} /></button><div className="account-links"><a href="#register">Create an account</a><a href="#forgot">Forgot password?</a></div></div></div>;
  if (type === "size-guide") return <div className="page shell content-page"><p className="eyebrow">Fit notes</p><h1>{title}</h1><p className="page-lede">{intro}</p><table className="size-table"><thead><tr><th>Size</th><th>Bust</th><th>Waist</th><th>Hip</th></tr></thead><tbody>{[["XS", "31–32", "24–25", "34–35"], ["S", "33–34", "26–27", "36–37"], ["M", "35–36", "28–29", "38–39"], ["L", "37–39", "30–32", "40–42"], ["XL", "40–42", "33–35", "43–45"]].map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell}>{cell}{cell === row[0] ? "" : " in"}</td>)}</tr>)}</tbody></table></div>;
  return <div className={`page shell content-page ${type}-content`}><p className="eyebrow">{type === "journal" ? "From the studio" : "Veloura studio"}</p><h1>{title}</h1><p className="page-lede">{intro}</p>{type === "about" && <><div className="large-content-image"><img src={editorialImage} alt="Veloura studio" /></div><div className="prose-columns"><p>We started Veloura with a simple belief: getting dressed can be a small act of self-expression. Our collections are designed in Lahore and made in small, thoughtful runs, with details that reveal themselves over time.</p><p>We are interested in the space between everyday and extraordinary. The dress you reach for on a Tuesday. The coat that changes your posture. Pieces that meet you where you are, and keep going with you.</p></div></>}{type === "journal" && <div className="journal-list">{[["A softer kind of statement", "On the quiet power of wearing something that feels like you."], ["The making of a signature", "Behind the scenes in our Lahore studio."], ["How to build a wardrobe with a point of view", "Five pieces, endless ways of wearing them."]].map(([heading, body], index) => <article key={heading}><span>0{index + 1}</span><div><h2>{heading}</h2><p>{body}</p><Link href="/shop" className="text-link">Read story <ArrowRight size={15} /></Link></div></article>)}</div>}{type === "faq" && <div className="faq-list">{["Where do you deliver?", "How long will my order take?", "What is your exchange policy?", "How do I care for my Veloura piece?", "How can I contact the studio?"].map((question) => <details key={question}><summary>{question}<Plus size={16} /></summary><p>We are happy to help. Reach out to our studio team for the most current information and we’ll get back to you within one working day.</p></details>)}</div>}{type === "contact" && <div className="contact-grid"><div><p className="eyebrow">Come say hello</p><p>hello@veloura.studio<br />+92 300 123 4567<br />Lahore, Pakistan</p><div className="socials"><Instagram size={17} /><Facebook size={17} /></div></div><form onSubmit={(event) => event.preventDefault()}><input placeholder="Your name" required /><input type="email" placeholder="Email address" required /><textarea placeholder="How can we help?" rows={5} required /><button className="button button-dark">Send message <ArrowRight size={16} /></button></form></div>}{type === "policies" && <div className="policy-list">{["Shipping", "Exchanges", "Privacy", "Terms"].map((heading) => <details key={heading} open={heading === "Shipping"}><summary>{heading}<Plus size={16} /></summary><p>We offer complimentary delivery on orders over Rs. 5,000. Orders are dispatched within 1–2 working days. For exchanges, please contact us within seven days of delivery with your order details.</p></details>)}</div>}</div>;
}

function AppRoutes() {
  const [location] = useLocation();
  const [search, setSearch] = useState("");
  const { toast, showToast } = useToast();
  const page = location.split("?")[0];
  return <><Header onSearch={setSearch} /><Switch><Route path="/" component={() => <HomePage onToast={showToast} />} /><Route path="/shop" component={() => <ShopPage onToast={showToast} />} /><Route path="/product/:slug" component={() => <ProductPage onToast={showToast} />} /><Route path="/wishlist" component={() => <WishlistPage onToast={showToast} />} /><Route path="/cart" component={CartPage} /><Route path="/checkout" component={() => <CheckoutPage onToast={showToast} />} /><Route path="/about" component={() => <ContentPage type="about" />} /><Route path="/contact" component={() => <ContentPage type="contact" />} /><Route path="/faq" component={() => <ContentPage type="faq" />} /><Route path="/policies" component={() => <ContentPage type="policies" />} /><Route path="/size-guide" component={() => <ContentPage type="size-guide" />} /><Route path="/journal" component={() => <ContentPage type="journal" />} /><Route path="/account" component={() => <ContentPage type="account" />} /><Route><HomePage onToast={showToast} /></Route></Switch><Footer /><CartDrawer /><Toast message={toast} /></>;
}

export default function App() {
  return <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}><AppRoutes /></WouterRouter>;
}