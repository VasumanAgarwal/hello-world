"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = [
  { value: "pending_payment", label: "Pending Payment" },
  { value: "payment_received", label: "Payment Received" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

interface OrderStatusUpdaterProps {
  orderId: string;
  currentStatus: string;
}

export function OrderStatusUpdater({ orderId, currentStatus }: OrderStatusUpdaterProps) {
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  const handleUpdate = async () => {
    if (status === currentStatus) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        router.refresh();
      }
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-[#003087]"
      >
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      <button
        onClick={handleUpdate}
        disabled={saving || status === currentStatus}
        className="bg-[#003087] hover:bg-[#004bb5] disabled:bg-gray-700 disabled:text-gray-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
      >
        {saving ? "Saving..." : saved ? "✓ Saved" : "Update Status"}
      </button>
    </div>
  );
}
