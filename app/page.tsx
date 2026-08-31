import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featuredProducts = await prisma.product.findMany({
    where: { stock: { gt: 0 } },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-[#0a0a0a] border-b border-[#1a1a1a] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#003087]/20 via-transparent to-transparent" />
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 overflow-hidden">
          <div className="text-[20rem] font-black text-[#003087] select-none leading-none">
            PS2
          </div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#003087]/20 border border-[#003087]/40 rounded-full px-4 py-1.5 mb-6">
              <div className="w-2 h-2 bg-[#003087] rounded-full" />
              <span className="text-[#4a7ec7] text-sm font-medium">
                Delhi, India
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-6">
              Pllum Legno
              <span className="block text-[#003087]">PS2 Dead Stock</span>
            </h1>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Authentic PlayStation 2 dead stock lots straight from Delhi.
              Consoles, games, accessories — all original, all untouched.
              Collector&apos;s grade inventory at wholesale prices.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="bg-[#003087] hover:bg-[#004bb5] text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Browse Lots
              </Link>
              <Link
                href="/products?category=Lot"
                className="border border-[#333] hover:border-[#003087] text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                View Bulk Lots
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "📦",
                title: "Dead Stock",
                desc: "Genuine NOS inventory from Delhi warehouses",
              },
              {
                icon: "🇮🇳",
                title: "Ships from Delhi",
                desc: "Fast delivery across India via courier",
              },
              {
                icon: "🏦",
                title: "Bank Transfer",
                desc: "Secure HDFC bank transfer payments",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-[#141414] border border-[#1f1f1f] rounded-lg p-6 text-center"
              >
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="text-white font-semibold mb-1">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Featured Lots</h2>
            <p className="text-gray-500 text-sm mt-1">
              Latest arrivals in stock
            </p>
          </div>
          <Link
            href="/products"
            className="text-[#4a7ec7] hover:text-white text-sm transition-colors"
          >
            View all &rarr;
          </Link>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <div className="text-5xl mb-4">🎮</div>
            <p>No products available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}
      </section>

      {/* Bank Transfer Banner */}
      <section className="bg-[#003087]/10 border-y border-[#003087]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
          <h3 className="text-white font-bold text-xl mb-2">
            Simple Payment Process
          </h3>
          <p className="text-gray-400 mb-4 max-w-lg mx-auto">
            Place your order, then transfer the amount to our HDFC bank account.
            We ship once payment is confirmed.
          </p>
          <div className="inline-flex items-center gap-2 bg-[#0a0a0a] border border-[#003087]/40 rounded-lg px-6 py-3">
            <span className="text-gray-400 text-sm">HDFC Bank</span>
            <span className="text-gray-600">•</span>
            <span className="text-white font-medium text-sm">Pllum Legno</span>
          </div>
        </div>
      </section>
    </div>
  );
}
