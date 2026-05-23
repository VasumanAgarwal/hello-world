"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh",
];

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "Delhi",
    pincode: "",
  });

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🛒</div>
        <h1 className="text-xl font-bold text-white mb-3">Your cart is empty</h1>
        <Link href="/products" className="text-[#4a7ec7] hover:text-white">
          Continue shopping
        </Link>
      </div>
    );
  }

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.customerName.trim()) e.customerName = "Name is required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Valid email required";
    if (!form.phone.trim() || !/^[6-9]\d{9}$/.test(form.phone))
      e.phone = "Valid 10-digit Indian mobile number required";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.state) e.state = "State is required";
    if (!form.pincode.trim() || !/^\d{6}$/.test(form.pincode))
      e.pincode = "Valid 6-digit pincode required";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({
            productId: i.id,
            quantity: i.quantity,
            price: i.price,
          })),
          total: totalPrice,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Order failed");
      }
      clearCart();
      router.push(`/orders/${data.id}`);
    } catch (err) {
      setErrors({ submit: (err as Error).message });
      setSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const inputClass =
    "w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#003087] transition-colors";
  const labelClass = "block text-sm font-medium text-gray-400 mb-1";
  const errorClass = "text-red-400 text-xs mt-1";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-white mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          {/* Contact */}
          <div className="bg-[#141414] border border-[#1f1f1f] rounded-lg p-6">
            <h2 className="text-white font-semibold mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={labelClass}>Full Name</label>
                <input
                  type="text"
                  name="customerName"
                  value={form.customerName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className={inputClass}
                />
                {errors.customerName && (
                  <p className={errorClass}>{errors.customerName}</p>
                )}
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={inputClass}
                />
                {errors.email && <p className={errorClass}>{errors.email}</p>}
              </div>
              <div>
                <label className={labelClass}>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  className={inputClass}
                />
                {errors.phone && <p className={errorClass}>{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-[#141414] border border-[#1f1f1f] rounded-lg p-6">
            <h2 className="text-white font-semibold mb-4">Shipping Address</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Street Address</label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Flat/House No., Building, Street, Area"
                  rows={3}
                  className={inputClass}
                />
                {errors.address && (
                  <p className={errorClass}>{errors.address}</p>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>City</label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="City"
                    className={inputClass}
                  />
                  {errors.city && <p className={errorClass}>{errors.city}</p>}
                </div>
                <div>
                  <label className={labelClass}>State</label>
                  <select
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  {errors.state && <p className={errorClass}>{errors.state}</p>}
                </div>
                <div>
                  <label className={labelClass}>Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    placeholder="110001"
                    maxLength={6}
                    className={inputClass}
                  />
                  {errors.pincode && (
                    <p className={errorClass}>{errors.pincode}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {errors.submit && (
            <p className="text-red-400 text-sm">{errors.submit}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-3 rounded-lg font-semibold transition-colors ${
              submitting
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-[#003087] hover:bg-[#004bb5] text-white"
            }`}
          >
            {submitting ? "Placing Order..." : "Place Order"}
          </button>
        </form>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-[#141414] border border-[#1f1f1f] rounded-lg p-6 sticky top-20">
            <h2 className="text-white font-bold mb-4">Order Summary</h2>
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
            <div className="border-t border-[#1f1f1f] pt-4">
              <div className="flex justify-between mb-4">
                <span className="text-white font-semibold">Total</span>
                <span className="text-white font-bold text-lg">
                  ₹{totalPrice.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Bank details preview */}
            <div className="bg-[#0f0f0f] border border-[#003087]/30 rounded-lg p-4">
              <p className="text-[#4a7ec7] text-xs font-semibold mb-2 uppercase tracking-wider">
                Payment Instructions
              </p>
              <p className="text-gray-400 text-xs leading-relaxed">
                After placing your order, you&apos;ll receive HDFC bank account
                details to complete the transfer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
