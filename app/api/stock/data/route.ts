import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export interface StockRow {
  "Product Name And Style": string;
  Size: string;
  "Grain Style": string;
  Group: string;
  "Item Code and Group": string;
  "Qty In Hand": number;
}

interface GraphUsedRangeResponse {
  values: (string | number | boolean | null)[][];
}

interface GraphSearchResponse {
  value: Array<{ id: string; name: string; parentReference?: { driveId?: string } }>;
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accessToken = (session as { accessToken?: string }).accessToken;
  if (!accessToken) {
    return Response.json({ error: "No access token in session" }, { status: 401 });
  }

  const filePath = process.env.ONEDRIVE_FILE_PATH;

  try {
    let rows: StockRow[] = [];

    if (filePath) {
      // Use the direct path approach
      const encodedPath = encodeURIComponent(filePath);
      const rangeUrl = `https://graph.microsoft.com/v1.0/me/drive/root:/${encodedPath}:/workbook/worksheets/Sheet1/usedRange`;

      const rangeRes = await fetch(rangeUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!rangeRes.ok) {
        if (rangeRes.status === 404) {
          return Response.json(
            { error: `Excel file not found at path: ${filePath}. Check ONEDRIVE_FILE_PATH env var.` },
            { status: 404 }
          );
        }
        const errText = await rangeRes.text();
        return Response.json(
          { error: `Graph API error: ${rangeRes.status} — ${errText}` },
          { status: 502 }
        );
      }

      const rangeData: GraphUsedRangeResponse = await rangeRes.json();
      rows = parseUsedRange(rangeData);
    } else {
      // Search for any .xlsx file in OneDrive
      const searchUrl = `https://graph.microsoft.com/v1.0/me/drive/root/search(q='.xlsx')`;
      const searchRes = await fetch(searchUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!searchRes.ok) {
        const errText = await searchRes.text();
        return Response.json(
          { error: `Graph API search error: ${searchRes.status} — ${errText}` },
          { status: 502 }
        );
      }

      const searchData: GraphSearchResponse = await searchRes.json();
      if (!searchData.value || searchData.value.length === 0) {
        return Response.json(
          { error: "No Excel files found in OneDrive. Set ONEDRIVE_FILE_PATH to point to your stock file." },
          { status: 404 }
        );
      }

      // Use the first xlsx file found
      const file = searchData.value[0];
      const driveId = file.parentReference?.driveId;
      const fileId = file.id;

      let rangeUrl: string;
      if (driveId) {
        rangeUrl = `https://graph.microsoft.com/v1.0/me/drives/${driveId}/items/${fileId}/workbook/worksheets/Sheet1/usedRange`;
      } else {
        rangeUrl = `https://graph.microsoft.com/v1.0/me/drive/items/${fileId}/workbook/worksheets/Sheet1/usedRange`;
      }

      const rangeRes = await fetch(rangeUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!rangeRes.ok) {
        const errText = await rangeRes.text();
        return Response.json(
          { error: `Graph API range error: ${rangeRes.status} — ${errText}` },
          { status: 502 }
        );
      }

      const rangeData: GraphUsedRangeResponse = await rangeRes.json();
      rows = parseUsedRange(rangeData);
    }

    // Filter: show rows where Qty In Hand < 10
    const filtered = rows.filter((r) => r["Qty In Hand"] < 10);

    return Response.json({ rows: filtered });
  } catch (err) {
    console.error("[stock/data]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

function parseUsedRange(data: GraphUsedRangeResponse): StockRow[] {
  const { values } = data;
  if (!values || values.length < 2) return [];

  const headers = values[0].map((h) => String(h ?? "").trim());
  const dataRows = values.slice(1);

  const expectedCols = [
    "Product Name And Style",
    "Size",
    "Grain Style",
    "Group",
    "Item Code and Group",
    "Qty In Hand",
  ];

  // Map column names to indices
  const colIndex: Record<string, number> = {};
  for (const col of expectedCols) {
    const idx = headers.indexOf(col);
    colIndex[col] = idx;
  }

  return dataRows
    .map((row) => {
      const get = (col: string): string | number => {
        const idx = colIndex[col];
        if (idx === -1 || idx === undefined) return "";
        const val = row[idx] ?? "";
        if (typeof val === "boolean") return val ? "true" : "false";
        return val;
      };

      const qtyRaw = get("Qty In Hand");
      const qty = typeof qtyRaw === "number" ? qtyRaw : parseFloat(String(qtyRaw)) || 0;

      return {
        "Product Name And Style": String(get("Product Name And Style")),
        Size: String(get("Size")),
        "Grain Style": String(get("Grain Style")),
        Group: String(get("Group")),
        "Item Code and Group": String(get("Item Code and Group")),
        "Qty In Hand": qty,
      } satisfies StockRow;
    })
    .filter((r) => r["Item Code and Group"] !== "" || r["Product Name And Style"] !== "");
}
