"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeleteProductButtonProps {
  id: string;
  name: string;
}

export function DeleteProductButton({ id, name }: DeleteProductButtonProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete product");
        setDeleting(false);
      }
    } catch {
      alert("Failed to delete product");
      setDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="text-red-500 hover:text-red-400 disabled:text-gray-600 text-sm transition-colors"
    >
      {deleting ? "Deleting..." : "Delete"}
    </button>
  );
}
