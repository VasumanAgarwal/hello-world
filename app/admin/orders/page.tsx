import { prisma } from "@/lib/db";
import { OrderStatusUpdater } from "./OrderStatusUpdater";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  pending_payment: "Pending Payment",
  payment_received: "Payment Received",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STATUS_COLORS: Record<string, string> = {
  pending_payment: "bg-yellow-900/40 text-yellow-400",
  payment_received: "bg-blue-900/40 text-blue-400",
  shipped: "bg-purple-900/40 text-purple-400",
  delivered: "bg-green-900/40 text-green-400",
  cancelled: "bg-red-900/40 text-red-400",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      items: { include: { product: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Orders</h1>
          <p className="text-gray-500 text-sm mt-1">{orders.length} total orders</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-[#141414] border border-[#1f1f1f] rounded-xl px-6 py-16 text-center text-gray-500">
          <div className="text-4xl mb-3">📋</div>
          <p>No orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-[#141414] border border-[#1f1f1f] rounded-xl p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-gray-400 font-mono text-sm">
                      #{order.id.slice(-12)}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        STATUS_COLORS[order.status] ?? "bg-gray-800 text-gray-400"
                      }`}
                    >
                      {STATUS_LABELS[order.status] ?? order.status}
                    </span>
                  </div>
                  <p className="text-white font-semibold">{order.customerName}</p>
                  <p className="text-gray-500 text-sm">{order.email} · {order.phone}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-lg">
                    ₹{order.total.toLocaleString("en-IN")}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {new Date(order.createdAt).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div className="bg-[#0f0f0f] rounded-lg p-3 mb-4">
                <p className="text-gray-500 text-xs mb-2">Items</p>
                <div className="space-y-1">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-300">
                        {item.product.name} × {item.quantity}
                      </span>
                      <span className="text-gray-400">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping */}
              <div className="bg-[#0f0f0f] rounded-lg p-3 mb-4 text-sm">
                <p className="text-gray-500 text-xs mb-1">Ship to</p>
                <p className="text-gray-300">{order.address}</p>
                <p className="text-gray-400">
                  {order.city}, {order.state} — {order.pincode}
                </p>
              </div>

              {/* Status updater */}
              <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
