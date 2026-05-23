import { prisma } from "@/lib/db";
import Link from "next/link";
import { DeleteProductButton } from "./DeleteProductButton";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} total products</p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-[#003087] hover:bg-[#004bb5] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + Add Product
        </Link>
      </div>

      <div className="bg-[#141414] border border-[#1f1f1f] rounded-xl overflow-hidden">
        {products.length === 0 ? (
          <div className="px-6 py-16 text-center text-gray-500">
            <div className="text-4xl mb-3">📦</div>
            <p>No products yet.</p>
            <Link
              href="/admin/products/new"
              className="text-[#4a7ec7] hover:text-white text-sm mt-2 inline-block"
            >
              Add your first product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-[#1f1f1f]">
                  <th className="px-6 py-3 text-gray-500 text-xs font-medium">NAME</th>
                  <th className="px-6 py-3 text-gray-500 text-xs font-medium">CATEGORY</th>
                  <th className="px-6 py-3 text-gray-500 text-xs font-medium">CONDITION</th>
                  <th className="px-6 py-3 text-gray-500 text-xs font-medium">PRICE</th>
                  <th className="px-6 py-3 text-gray-500 text-xs font-medium">STOCK</th>
                  <th className="px-6 py-3 text-gray-500 text-xs font-medium">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-[#1a1a1a] hover:bg-[#1a1a1a] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="text-white text-sm font-medium max-w-xs truncate">
                        {product.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {product.category}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">
                        {product.condition}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white text-sm">
                      ₹{product.price.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-sm font-medium ${
                          product.stock === 0
                            ? "text-red-400"
                            : product.stock <= 5
                            ? "text-orange-400"
                            : "text-green-400"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="text-[#4a7ec7] hover:text-white text-sm transition-colors"
                        >
                          Edit
                        </Link>
                        <DeleteProductButton id={product.id} name={product.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
