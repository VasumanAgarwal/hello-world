import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductForm } from "../../ProductForm";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) notFound();

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/products"
          className="text-gray-500 hover:text-white transition-colors"
        >
          ← Products
        </Link>
        <span className="text-gray-700">/</span>
        <h1 className="text-xl font-bold text-white">Edit Product</h1>
      </div>
      <ProductForm initialData={product} isEdit />
    </div>
  );
}
