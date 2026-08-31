"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { StockRow } from "@/app/api/stock/data/route";

const EXCLUDED_GROUPS_KEY = "stock_excluded_groups";

export function StockClient() {
  const [rows, setRows] = useState<StockRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [excludedGroupsInput, setExcludedGroupsInput] = useState("");
  const [excludedGroups, setExcludedGroups] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(EXCLUDED_GROUPS_KEY);
      if (stored) {
        const groups: string[] = JSON.parse(stored);
        setExcludedGroups(groups);
        setExcludedGroupsInput(groups.join(", "));
      }
    } catch {
      // localStorage unavailable
    }
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stock/data");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to fetch stock data");
        setRows([]);
      } else {
        setRows(data.rows ?? []);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaveExclusions = () => {
    const groups = excludedGroupsInput
      .split(",")
      .map((g) => g.trim())
      .filter(Boolean);
    setExcludedGroups(groups);
    try {
      localStorage.setItem(EXCLUDED_GROUPS_KEY, JSON.stringify(groups));
    } catch {
      // localStorage unavailable
    }
  };

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      if (excludedGroups.some((g) => g.toLowerCase() === row.Group.toLowerCase())) {
        return false;
      }
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        return (
          row["Product Name And Style"].toLowerCase().includes(q) ||
          row.Group.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [rows, excludedGroups, search]);

  const handleExportCSV = () => {
    const headers = [
      "Item Code and Group",
      "Product Name And Style",
      "Size",
      "Grain Style",
      "Group",
      "Qty In Hand",
    ];
    const csvRows = [
      headers.join(","),
      ...filteredRows.map((r) =>
        headers
          .map((h) => {
            const val = r[h as keyof StockRow];
            const str = String(val ?? "");
            return str.includes(",") || str.includes('"') || str.includes("\n")
              ? `"${str.replace(/"/g, '""')}"`
              : str;
          })
          .join(",")
      ),
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stock-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const qtyColor = (qty: number) => {
    if (qty < 5) return "text-red-400 font-bold";
    if (qty < 10) return "text-orange-400 font-semibold";
    return "text-white";
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dead / Slow-Moving Stock</h1>
            <p className="text-gray-400 text-sm mt-1">Items with Qty In Hand &lt; 10</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              disabled={loading}
              className="px-4 py-2 rounded bg-[#003087] hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
            >
              {loading ? "Loading…" : "Refresh"}
            </button>
            <button
              onClick={handleExportCSV}
              disabled={filteredRows.length === 0}
              className="px-4 py-2 rounded bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#333] transition-colors text-sm font-medium disabled:opacity-50"
            >
              Export CSV
            </button>
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-4 mb-6">
          <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wider">
            Exclude New Catalogue Groups
          </p>
          <div className="flex gap-3 items-center flex-wrap">
            <input
              type="text"
              value={excludedGroupsInput}
              onChange={(e) => setExcludedGroupsInput(e.target.value)}
              placeholder="e.g. Group A, Group B"
              className="flex-1 min-w-[200px] bg-[#111] border border-[#333] rounded px-3 py-2 text-sm placeholder-gray-600 focus:outline-none focus:border-[#003087]"
            />
            <button
              onClick={handleSaveExclusions}
              className="px-4 py-2 rounded bg-[#003087] hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Save
            </button>
          </div>
          {excludedGroups.length > 0 && (
            <p className="text-xs text-gray-500 mt-2">
              Excluding: {excludedGroups.join(", ")}
            </p>
          )}
        </div>

        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Product Name or Group…"
            className="w-full bg-[#111] border border-[#333] rounded px-4 py-2 text-sm placeholder-gray-600 focus:outline-none focus:border-[#003087]"
          />
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-6 text-red-300 text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-16 text-gray-500">
            <div className="inline-block w-6 h-6 border-2 border-[#003087] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm">Fetching stock data from OneDrive…</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <p className="text-xs text-gray-500 mb-3">
              {filteredRows.length} item{filteredRows.length !== 1 ? "s" : ""} shown
            </p>
            {filteredRows.length === 0 ? (
              <div className="text-center py-16 text-gray-600 text-sm">
                No low-stock items found matching your filters.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-[#1a1a1a]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#0a0a0a] border-b border-[#1a1a1a]">
                      <th className="text-left px-4 py-3 text-gray-400 font-medium text-xs uppercase tracking-wider whitespace-nowrap">
                        Item Code and Group
                      </th>
                      <th className="text-left px-4 py-3 text-gray-400 font-medium text-xs uppercase tracking-wider whitespace-nowrap">
                        Product Name And Style
                      </th>
                      <th className="text-left px-4 py-3 text-gray-400 font-medium text-xs uppercase tracking-wider">
                        Size
                      </th>
                      <th className="text-left px-4 py-3 text-gray-400 font-medium text-xs uppercase tracking-wider whitespace-nowrap">
                        Grain Style
                      </th>
                      <th className="text-left px-4 py-3 text-gray-400 font-medium text-xs uppercase tracking-wider">
                        Group
                      </th>
                      <th className="text-right px-4 py-3 text-gray-400 font-medium text-xs uppercase tracking-wider whitespace-nowrap">
                        Qty In Hand
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.map((row, i) => (
                      <tr
                        key={i}
                        className={`border-b border-[#111] ${
                          i % 2 === 0 ? "bg-[#0f0f0f]" : "bg-[#0a0a0a]"
                        } hover:bg-[#131313] transition-colors`}
                      >
                        <td className="px-4 py-3 font-mono text-xs text-gray-300 whitespace-nowrap">
                          {row["Item Code and Group"]}
                        </td>
                        <td className="px-4 py-3 text-white max-w-xs">
                          {row["Product Name And Style"]}
                        </td>
                        <td className="px-4 py-3 text-gray-300 whitespace-nowrap">
                          {row.Size}
                        </td>
                        <td className="px-4 py-3 text-gray-300 whitespace-nowrap">
                          {row["Grain Style"]}
                        </td>
                        <td className="px-4 py-3 text-gray-400">
                          <span className="px-2 py-0.5 rounded text-xs bg-[#1a1a1a] border border-[#222]">
                            {row.Group}
                          </span>
                        </td>
                        <td className={`px-4 py-3 text-right ${qtyColor(row["Qty In Hand"])}`}>
                          {row["Qty In Hand"]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
