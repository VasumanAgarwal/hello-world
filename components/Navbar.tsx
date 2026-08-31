"use client";

import Link from "next/link";
import { CartIcon } from "./CartIcon";
import { useSession, signOut } from "next-auth/react";

export function Navbar() {
  const { data: session } = useSession();

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
            {session && (
              <Link
                href="/stock"
                className="text-[#003087] hover:text-blue-400 transition-colors text-sm font-semibold"
              >
                Stock
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4">
            {session ? (
              <button
                onClick={() => signOut()}
                className="text-gray-400 hover:text-white transition-colors text-xs"
              >
                Sign out
              </button>
            ) : null}
            <CartIcon />
          </div>
        </div>
      </div>
    </nav>
  );
}
