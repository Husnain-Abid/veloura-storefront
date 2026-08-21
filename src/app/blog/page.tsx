const BLOG_POSTS = [
  {
    title: "10 Must-Have Essentials for a Capsule Wardrobe",
    excerpt: "Discover the timeless pieces every woman should own to build a versatile and stylish capsule wardrobe.",
    date: "May 15, 2024",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
    category: "Style Guide",
    slug: "capsule-wardrobe-essentials"
  },
  {
    title: "The Ultimate Guide to Choosing the Right Intimates",
    excerpt: "Learn how to find the perfect fit and style for your body type with our comprehensive guide to luxury intimates.",
    date: "May 10, 2024",
    image: "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?q=80&w=800&auto=format&fit=crop",
    category: "Intimates",
    slug: "choosing-right-intimates"
  },
  {
    title: "Transitioning Your Style from Day to Night",
    excerpt: "Tips and tricks on how to effortlessly transform your daytime look into a sophisticated evening outfit.",
    date: "May 05, 2024",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800&auto=format&fit=crop",
    category: "Fashion Tips",
    slug: "day-to-night-style"
  }
];

export default function BlogListingPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-4xl mx-auto text-center mb-24">
        <h1 className="text-5xl md:text-8xl font-serif mb-8">The Journal</h1>
        <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">Insights into Fashion, Lifestyle, and Elegance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
        {BLOG_POSTS.map((post) => (
          <article key={post.slug} className="flex flex-col group">
            <div className="aspect-[4/5] overflow-hidden bg-gray-100 mb-8 relative">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute top-4 left-4 bg-white px-3 py-1 text-[9px] font-bold uppercase tracking-widest shadow-sm">
                {post.category}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">{post.date}</span>
              <h2 className="text-2xl font-serif group-hover:text-gray-600 transition-colors">
                <a href={`/blog/${post.slug}`}>{post.title}</a>
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>
              <a 
                href={`/blog/${post.slug}`}
                className="text-[10px] font-bold uppercase tracking-widest border-b border-black w-fit pb-1 mt-2 group-hover:pl-2 transition-all"
              >
                Read More
              </a>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-24 pt-12 border-t border-gray-100 flex justify-center">
        <button className="text-xs font-bold uppercase tracking-widest border border-black px-12 py-5 hover:bg-black hover:text-white transition-all">
          Load More Posts
        </button>
      </div>
    </div>
  );
}
