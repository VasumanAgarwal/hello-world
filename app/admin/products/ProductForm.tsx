"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProductFormProps {
  initialData?: {
    id?: string;
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    images?: string;
    category?: string;
    condition?: string;
  };
  isEdit?: boolean;
}

const CATEGORIES = ["Console", "Games", "Accessories", "Lot", "Controllers"];
const CONDITIONS = ["Dead Stock", "Used", "Refurbished", "New"];

export function ProductForm({ initialData, isEdit }: ProductFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  let initialImages = "";
  if (initialData?.images) {
    try {
      const parsed = JSON.parse(initialData.images);
      if (Array.isArray(parsed)) {
        initialImages = parsed.join("\n");
      }
    } catch {
      initialImages = "";
    }
  }

  const [form, setForm] = useState({
    name: initialData?.name ?? "",
    description: initialData?.description ?? "",
    price: initialData?.price?.toString() ?? "",
    stock: initialData?.stock?.toString() ?? "",
    imagesText: initialImages,
    category: initialData?.category ?? "Games",
    condition: initialData?.condition ?? "Dead Stock",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const images = form.imagesText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      images: JSON.stringify(images),
      category: form.category,
      condition: form.condition,
    };

    try {
      const url = isEdit
        ? `/api/products/${initialData?.id}`
        : "/api/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to save");
      } else {
        router.push("/admin/products");
        router.refresh();
      }
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#003087] transition-colors";
  const labelClass = "block text-sm font-medium text-gray-400 mb-1";

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="bg-[#141414] border border-[#1f1f1f] rounded-xl p-6 space-y-4">
        <h2 className="text-white font-semibold mb-2">Product Details</h2>

        <div>
          <label className={labelClass}>Product Name *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="e.g. PS2 Console Dead Stock Lot (5 units)"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Description *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={5}
            placeholder="Describe the lot contents, condition, quantity, what's included..."
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Price (₹) *</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              placeholder="e.g. 4999"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Stock Quantity *</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              required
              min="0"
              placeholder="e.g. 10"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Category *</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className={inputClass}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Condition *</label>
            <select
              name="condition"
              value={form.condition}
              onChange={handleChange}
              className={inputClass}
            >
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Image URLs (one per line)</label>
          <textarea
            name="imagesText"
            value={form.imagesText}
            onChange={handleChange}
            rows={3}
            placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
            className={inputClass}
          />
          <p className="text-gray-600 text-xs mt-1">
            Enter one image URL per line. Leave empty to use placeholder.
          </p>
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-[#003087] hover:bg-[#004bb5] disabled:bg-gray-700 disabled:text-gray-500 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors"
        >
          {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Product"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="border border-[#333] hover:border-[#555] text-gray-400 hover:text-white px-6 py-2.5 rounded-lg font-semibold transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
