import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { Navbar } from "@/components/Navbar";
import { NextAuthProvider } from "@/components/NextAuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pllum Legno — PS2 Dead Stock Lots",
  description:
    "Shop authentic PS2 dead stock lots from Delhi, India. Consoles, games, and accessories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#0f0f0f] text-white antialiased">
        <NextAuthProvider>
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="bg-[#0a0a0a] border-t border-[#1a1a1a] py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-[#003087] rounded flex items-center justify-center">
                    <span className="text-white font-bold text-xs">PS2</span>
                  </div>
                  <span className="text-white font-semibold">Pllum Legno</span>
                </div>
                <p className="text-gray-500 text-sm text-center">
                  Authentic PlayStation 2 dead stock lots from Delhi, India
                </p>
                <p className="text-gray-600 text-xs">
                  © {new Date().getFullYear()} Pllum Legno
                </p>
              </div>
            </div>
          </footer>
        </CartProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
