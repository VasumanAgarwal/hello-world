"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Invalid password");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#003087] rounded-lg flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-black text-sm">PS2</span>
          </div>
          <h1 className="text-xl font-bold text-white">Admin Login</h1>
          <p className="text-gray-500 text-sm">Pllum Legno Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#141414] border border-[#1f1f1f] rounded-xl p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#003087]"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm mb-4">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-[#003087] hover:bg-[#004bb5] disabled:bg-gray-700 disabled:text-gray-500 text-white py-2.5 rounded-lg font-semibold transition-colors"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
