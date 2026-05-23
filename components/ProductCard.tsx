"use client";

import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  condition: string;
  category: string;
  images: string;
  stock: number;
}

export function ProductCard({
  id,
  name,
  price,
  condition,
  category,
  images,
  stock,
}: ProductCardProps) {
  let imageUrl = "/placeholder-ps2.svg";
  try {
    const parsed = JSON.parse(images);
    if (Array.isArray(parsed) && parsed.length > 0) {
      imageUrl = parsed[0];
    }
  } catch {
    // use placeholder
  }

  const conditionColor =
    condition === "Dead Stock"
      ? "bg-green-900 text-green-300"
      : condition === "Refurbished"
      ? "bg-blue-900 text-blue-300"
      : "bg-gray-800 text-gray-300";

  return (
    <Link href={`/products/${id}`} className="group block">
      <div className="bg-[#141414] border border-[#1f1f1f] rounded-lg overflow-hidden hover:border-[#003087] transition-all duration-200 group-hover:shadow-lg group-hover:shadow-[#003087]/10">
        <div className="relative aspect-square bg-[#0f0f0f] overflow-hidden">
          {imageUrl.startsWith("/placeholder") ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-2">🎮</div>
                <span className="text-gray-600 text-xs uppercase tracking-wider">
                  {category}
                </span>
              </div>
            </div>
          ) : (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}
          {stock === 0 && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <span className="text-white font-semibold text-sm uppercase tracking-wider">
                Sold Out
              </span>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-white font-medium text-sm leading-tight line-clamp-2">
              {name}
            </h3>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${conditionColor}`}
            >
              {condition}
            </span>
            <span className="text-gray-500 text-xs">{category}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white font-bold text-lg">
              ₹{price.toLocaleString("en-IN")}
            </span>
            {stock > 0 && stock <= 5 && (
              <span className="text-orange-400 text-xs">
                Only {stock} left
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
