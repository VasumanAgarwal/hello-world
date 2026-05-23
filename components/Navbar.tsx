"use client";

import Link from "next/link";
import { CartIcon } from "./CartIcon";

export function Navbar() {
  return (
    <nav className="bg-[#0a0a0a] border-b border-[#1a1a1a] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#003087] rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">PS2</span>
            </div>
            <span className="text-white font-bold text-lg tracking-wide">
              Pllum Legno
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/products"
              className="text-gray-300 hover:text-white transition-colors text-sm"
            >
              All Lots
            </Link>
            <Link
              href="/products?category=Console"
              className="text-gray-300 hover:text-white transition-colors text-sm"
            >
              Consoles
            </Link>
            <Link
              href="/products?category=Games"
              className="text-gray-300 hover:text-white transition-colors text-sm"
            >
              Games
            </Link>
            <Link
              href="/products?category=Accessories"
              className="text-gray-300 hover:text-white transition-colors text-sm"
            >
              Accessories
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <CartIcon />
          </div>
        </div>
      </div>
    </nav>
  );
}
