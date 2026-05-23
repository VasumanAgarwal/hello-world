"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">🛒</div>
        <h1 className="text-2xl font-bold text-white mb-3">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">
          Add some PS2 lots to get started
        </p>
        <Link
          href="/products"
          className="bg-[#003087] hover:bg-[#004bb5] text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-white mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-[#141414] border border-[#1f1f1f] rounded-lg p-4 flex gap-4"
            >
              <div className="w-20 h-20 bg-[#0f0f0f] rounded-lg flex-shrink-0 overflow-hidden">
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">
                    🎮
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium truncate">{item.name}</h3>
                <p className="text-gray-500 text-sm mb-3">{item.condition}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 bg-[#1f1f1f] hover:bg-[#2a2a2a] text-white rounded flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="text-white w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 bg-[#1f1f1f] hover:bg-[#2a2a2a] text-white rounded flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-white font-semibold">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-600 hover:text-red-400 transition-colors text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-[#141414] border border-[#1f1f1f] rounded-lg p-6 sticky top-20">
            <h2 className="text-white font-bold text-lg mb-4">Order Summary</h2>

            <div className="space-y-2 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-400 truncate mr-2">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="text-gray-300 flex-shrink-0">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#1f1f1f] pt-4 mb-6">
              <div className="flex justify-between">
                <span className="text-white font-semibold">Total</span>
                <span className="text-white font-bold text-xl">
                  ₹{totalPrice.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="block w-full bg-[#003087] hover:bg-[#004bb5] text-white py-3 rounded-lg font-semibold text-center transition-colors"
            >
              Proceed to Checkout
            </Link>

            <p className="text-gray-600 text-xs text-center mt-3">
              Payment via HDFC bank transfer
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
