import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

interface ProductsPageProps {
  searchParams: Promise<{ category?: string; q?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const { category, q } = params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};
  if (category) where.category = category;
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { description: { contains: q } },
    ];
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  const categories = ["Console", "Games", "Accessories", "Lot"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">PS2 Lots</h1>
        <p className="text-gray-400">
          Dead stock PlayStation 2 inventory from Delhi
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <a
          href="/products"
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            !category
              ? "bg-[#003087] text-white"
              : "bg-[#141414] border border-[#1f1f1f] text-gray-400 hover:text-white"
          }`}
        >
          All
        </a>
        {categories.map((cat) => (
          <a
            key={cat}
            href={`/products?category=${cat}`}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              category === cat
                ? "bg-[#003087] text-white"
                : "bg-[#141414] border border-[#1f1f1f] text-gray-400 hover:text-white"
            }`}
          >
            {cat}
          </a>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <div className="text-5xl mb-4">🎮</div>
          <p className="text-lg">No products found</p>
          <p className="text-sm mt-1">Try a different category or check back later</p>
        </div>
      ) : (
        <>
          <p className="text-gray-500 text-sm mb-4">{products.length} item{products.length !== 1 ? "s" : ""} found</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
