"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string;
  category: string;
  condition: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          router.push("/products");
        } else {
          setProduct(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        router.push("/products");
      });
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">
        Loading...
      </div>
    );
  }

  if (!product) return null;

  let images: string[] = [];
  try {
    images = JSON.parse(product.images);
    if (!Array.isArray(images)) images = [];
  } catch {
    images = [];
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: images[0] ?? "",
      condition: product.condition,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const conditionColor =
    product.condition === "Dead Stock"
      ? "bg-green-900 text-green-300"
      : product.condition === "Refurbished"
      ? "bg-blue-900 text-blue-300"
      : "bg-gray-800 text-gray-300";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-white">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-white">Products</Link>
        <span>/</span>
        <span className="text-gray-300">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="aspect-square bg-[#141414] border border-[#1f1f1f] rounded-xl overflow-hidden mb-3">
            {images.length > 0 ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl mb-4">🎮</div>
                  <span className="text-gray-600 text-sm uppercase tracking-wider">
                    {product.category}
                  </span>
                </div>
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === i
                      ? "border-[#003087]"
                      : "border-[#1f1f1f]"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${conditionColor}`}>
              {product.condition}
            </span>
            <span className="text-gray-500 text-sm">{product.category}</span>
          </div>

          <h1 className="text-3xl font-bold text-white mb-4">{product.name}</h1>

          <div className="text-4xl font-black text-white mb-6">
            ₹{product.price.toLocaleString("en-IN")}
          </div>

          <div className="mb-6">
            <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">
              {product.description}
            </p>
          </div>

          {/* Stock */}
          <div className="mb-6">
            {product.stock === 0 ? (
              <div className="text-red-400 font-medium">Out of stock</div>
            ) : product.stock <= 5 ? (
              <div className="text-orange-400 font-medium">
                Only {product.stock} left in stock
              </div>
            ) : (
              <div className="text-green-400 font-medium">In stock</div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                product.stock === 0
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : addedToCart
                  ? "bg-green-700 text-white"
                  : "bg-[#003087] hover:bg-[#004bb5] text-white"
              }`}
            >
              {addedToCart ? "✓ Added to Cart" : "Add to Cart"}
            </button>
            <Link
              href="/cart"
              className="py-3 px-6 rounded-lg border border-[#333] hover:border-[#003087] text-white font-semibold transition-colors"
            >
              View Cart
            </Link>
          </div>

          {/* Bank info teaser */}
          <div className="mt-6 p-4 bg-[#141414] border border-[#1f1f1f] rounded-lg">
            <p className="text-gray-400 text-sm">
              <span className="text-white font-medium">Payment via bank transfer.</span>{" "}
              After placing your order, transfer to our HDFC account. We ship once
              payment is verified.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
