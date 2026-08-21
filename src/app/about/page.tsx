export default function AboutPage() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <section className="relative h-[60vh] w-full overflow-hidden bg-black flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop')` }}
        />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-8xl font-serif mb-6">Our Story</h1>
          <p className="text-xs font-bold uppercase tracking-[0.4em]">Defining Fashion Since 2024</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 container mx-auto px-4 max-w-4xl">
        <div className="space-y-12">
          <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-serif mb-8 leading-tight">Crafting Elegance for the Modern Pakistani Woman</h2>
            <p className="text-gray-500 text-lg leading-relaxed italic">
              "We started Elegance with a simple vision: to bridge the gap between high-end luxury and everyday comfort, specifically tailored for the modern lifestyle of Pakistan."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-12">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-black pb-2 inline-block">The Beginning</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Founded in Lahore, Elegance began as a small boutique specializing in western-inspired silhouettes. We noticed a growing demand for high-quality, tastefully designed western wear that resonates with local aesthetics. 
              </p>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-black pb-2 inline-block">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                To empower women through fashion that doesn't compromise on quality or ethics. We focus on premium materials, sustainable practices, and designs that make every woman feel confident and beautiful.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-24 bg-[#f9f9f9]">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="aspect-[4/5] bg-gray-200 overflow-hidden order-2 lg:order-1">
            <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop" alt="Philosophy" className="w-full h-full object-cover" />
          </div>
          <div className="order-1 lg:order-2 space-y-8">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Our Philosophy</span>
            <h2 className="text-4xl md:text-6xl font-serif leading-tight">Details that Matter</h2>
            <p className="text-gray-600 leading-relaxed">
              Every button, every stitch, and every fabric choice is made with intention. We believe that true luxury lies in the details that often go unnoticed but are always felt.
            </p>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <span className="text-2xl font-serif">01.</span>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-2">Sourced with Integrity</h4>
                  <p className="text-xs text-gray-500 leading-relaxed uppercase tracking-widest">We work with partners who share our commitment to fair wages and ethical production.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="text-2xl font-serif">02.</span>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-2">Timeless Design</h4>
                  <p className="text-xs text-gray-500 leading-relaxed uppercase tracking-widest">We create pieces that transcend trends and remain favorites in your wardrobe for years.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
