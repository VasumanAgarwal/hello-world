import Link from "next/link";
import { ProductForm } from "../ProductForm";

export default function NewProductPage() {
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
        <h1 className="text-xl font-bold text-white">Add New Product</h1>
      </div>
      <ProductForm />
    </div>
  );
}
