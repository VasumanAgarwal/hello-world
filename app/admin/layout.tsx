"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const navItems = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/products", label: "Products" },
    { href: "/admin/orders", label: "Orders" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Admin Sidebar / Top Nav */}
      <div className="bg-[#0d0d0d] border-b border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-[#003087] rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">PS2</span>
                </div>
                <span className="text-white font-semibold text-sm">
                  Admin
                </span>
              </div>
              <nav className="flex items-center gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-1.5 rounded text-sm transition-colors ${
                      pathname === item.href
                        ? "bg-[#003087]/20 text-[#4a7ec7]"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="text-gray-500 hover:text-white text-xs transition-colors"
                target="_blank"
              >
                View Site
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-400 text-xs transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}
