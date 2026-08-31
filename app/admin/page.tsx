import { prisma } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [totalOrders, pendingOrders, totalProducts, orders] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "pending_payment" } }),
    prisma.product.count(),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { items: true },
    }),
  ]);

  const revenue = await prisma.order.aggregate({
    where: {
      status: { in: ["payment_received", "shipped", "delivered"] },
    },
    _sum: { total: true },
  });

  const totalRevenue = revenue._sum.total ?? 0;

  const statusLabels: Record<string, string> = {
    pending_payment: "Pending Payment",
    payment_received: "Payment Received",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };

  const statusColors: Record<string, string> = {
    pending_payment: "bg-yellow-900/40 text-yellow-400",
    payment_received: "bg-blue-900/40 text-blue-400",
    shipped: "bg-purple-900/40 text-purple-400",
    delivered: "bg-green-900/40 text-green-400",
    cancelled: "bg-red-900/40 text-red-400",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <div className="flex gap-3">
          <Link
            href="/admin/products/new"
            className="bg-[#003087] hover:bg-[#004bb5] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            + Add Product
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Orders", value: totalOrders.toString(), color: "text-white" },
          { label: "Pending Payment", value: pendingOrders.toString(), color: "text-yellow-400" },
          { label: "Products", value: totalProducts.toString(), color: "text-blue-400" },
          {
            label: "Revenue",
            value: `₹${totalRevenue.toLocaleString("en-IN")}`,
            color: "text-green-400",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-[#141414] border border-[#1f1f1f] rounded-xl p-5"
          >
            <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-[#141414] border border-[#1f1f1f] rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1f1f1f]">
          <h2 className="text-white font-semibold">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-[#4a7ec7] text-sm hover:text-white transition-colors"
          >
            View all
          </Link>
        </div>
        {orders.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">
            No orders yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-[#1f1f1f]">
                  <th className="px-6 py-3 text-gray-500 text-xs font-medium">
                    ORDER
                  </th>
                  <th className="px-6 py-3 text-gray-500 text-xs font-medium">
                    CUSTOMER
                  </th>
                  <th className="px-6 py-3 text-gray-500 text-xs font-medium">
                    AMOUNT
                  </th>
                  <th className="px-6 py-3 text-gray-500 text-xs font-medium">
                    STATUS
                  </th>
                  <th className="px-6 py-3 text-gray-500 text-xs font-medium">
                    DATE
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-[#1a1a1a] hover:bg-[#1a1a1a] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/orders`}
                        className="text-[#4a7ec7] hover:text-white font-mono text-xs"
                      >
                        #{order.id.slice(-8)}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-white text-sm">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-4 text-white text-sm">
                      ₹{order.total.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[order.status] ?? "bg-gray-800 text-gray-400"}`}
                      >
                        {statusLabels[order.status] ?? order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
