import { prisma } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface OrderPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderConfirmationPage({ params }: OrderPageProps) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  if (!order) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Confirmation Header */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-green-900/50 border border-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-black text-white mb-2">Order Confirmed!</h1>
        <p className="text-gray-400">
          Thank you for your order. Please complete payment via bank transfer.
        </p>
        <p className="text-gray-600 text-sm mt-1">
          Order ID: <span className="text-gray-400 font-mono">{order.id}</span>
        </p>
      </div>

      {/* Bank Transfer Instructions */}
      <div className="bg-[#003087]/10 border border-[#003087]/40 rounded-xl p-6 mb-8">
        <h2 className="text-[#4a7ec7] font-bold text-lg mb-4 flex items-center gap-2">
          <span>🏦</span>
          Bank Transfer Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Bank", value: "HDFC Bank" },
            { label: "Account Name", value: "Pllum Legno" },
            { label: "Account Number", value: "50100XXXXXXXXX" },
            { label: "IFSC Code", value: "HDFC0001234" },
            { label: "Account Type", value: "Current Account" },
            {
              label: "Amount to Transfer",
              value: `₹${order.total.toLocaleString("en-IN")}`,
            },
          ].map(({ label, value }) => (
            <div key={label} className="bg-[#0a0a0a] rounded-lg p-3">
              <p className="text-gray-500 text-xs mb-1">{label}</p>
              <p className="text-white font-semibold">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-700/30 rounded-lg">
          <p className="text-yellow-400 text-sm">
            <strong>Important:</strong> Use your Order ID{" "}
            <span className="font-mono text-yellow-300">{order.id.slice(-8)}</span>{" "}
            as the transfer reference/remarks so we can identify your payment.
          </p>
        </div>
      </div>

      {/* Order Details */}
      <div className="bg-[#141414] border border-[#1f1f1f] rounded-xl p-6 mb-6">
        <h2 className="text-white font-bold mb-4">Order Details</h2>

        <div className="space-y-3 mb-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm">{item.product.name}</p>
                <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
              </div>
              <p className="text-white font-medium">
                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t border-[#1f1f1f] pt-4 flex justify-between">
          <span className="text-white font-bold">Total</span>
          <span className="text-white font-bold text-lg">
            ₹{order.total.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Shipping Info */}
      <div className="bg-[#141414] border border-[#1f1f1f] rounded-xl p-6 mb-8">
        <h2 className="text-white font-bold mb-3">Shipping To</h2>
        <p className="text-gray-300">{order.customerName}</p>
        <p className="text-gray-400 text-sm">{order.address}</p>
        <p className="text-gray-400 text-sm">
          {order.city}, {order.state} — {order.pincode}
        </p>
        <p className="text-gray-400 text-sm mt-1">{order.email}</p>
        <p className="text-gray-400 text-sm">{order.phone}</p>
      </div>

      {/* Status */}
      <div className="bg-[#141414] border border-[#1f1f1f] rounded-xl p-4 mb-8">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Order Status</span>
          <span className="bg-yellow-900/50 text-yellow-400 text-sm font-medium px-3 py-1 rounded-full">
            Pending Payment
          </span>
        </div>
      </div>

      <div className="text-center">
        <p className="text-gray-500 text-sm mb-4">
          We&apos;ll send a confirmation email to{" "}
          <span className="text-gray-300">{order.email}</span> once payment is
          verified.
        </p>
        <Link
          href="/products"
          className="text-[#4a7ec7] hover:text-white transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
