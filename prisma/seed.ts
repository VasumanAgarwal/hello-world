import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import BetterSqlite3 from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "dev.db");
const sqlite = new BetterSqlite3(dbPath);
const adapter = new PrismaBetterSqlite3({ url: dbPath });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  console.log("Seeding database...");

  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: [
      {
        name: "PS2 Console Dead Stock Lot — 5 Units (Slim, Black)",
        description:
          "Brand new dead stock PlayStation 2 Slim consoles, Black edition. Never opened, original Delhi warehouse stock. Each unit includes original controller, AV cable, and power adapter. Perfect for collectors or resellers.\n\nLot contents:\n- 5x PS2 Slim Console (Black)\n- 5x Original DualShock 2 controllers\n- 5x AV cables\n- 5x Power adapters\n- All in original sealed boxes",
        price: 18999,
        stock: 12,
        images: JSON.stringify([]),
        category: "Lot",
        condition: "Dead Stock",
      },
      {
        name: "PS2 Games Dead Stock Bundle — 20 Titles Mixed Lot",
        description:
          "Wholesale lot of 20 PlayStation 2 game titles, all new and sealed. Mix of popular titles including sports, action, racing, and RPG genres. Original Delhi distributor stock, never circulated to retail.\n\nIncludes:\n- 20 sealed PS2 games\n- Mixed genres (no duplicates guaranteed within a lot)\n- Original PAL/NTSC-J and US region mix\n- Collector's condition packaging",
        price: 4999,
        stock: 8,
        images: JSON.stringify([]),
        category: "Games",
        condition: "Dead Stock",
      },
      {
        name: "DualShock 2 Controllers — Bulk Lot of 10 (Original Sony)",
        description:
          "Genuine Sony DualShock 2 controllers in original packaging. Dead stock from Delhi distributor. All vibration functions intact, full analog support, genuine Sony manufacturing.\n\nDetails:\n- 10x Original Sony DualShock 2 controllers\n- Available in Black and Silver\n- New old stock — never used\n- Original retail packaging\n- Compatible with all PS2 models (Fat & Slim)",
        price: 6499,
        stock: 20,
        images: JSON.stringify([]),
        category: "Controllers",
        condition: "Dead Stock",
      },
      {
        name: "PS2 Memory Cards — 8MB Dead Stock Lot (Sony OEM, 10 pcs)",
        description:
          "Original Sony 8MB Memory Cards for PlayStation 2. Full lot of 10 units. Genuine OEM parts sourced from Delhi warehouse. Essential for any PS2 setup, these save-game cards are compatible with all PS2 models.\n\nSpecifications:\n- Capacity: 8MB\n- Brand: Sony (OEM)\n- Compatible: All PS2 models\n- Condition: New / Dead Stock\n- Quantity: 10 units per lot",
        price: 2499,
        stock: 35,
        images: JSON.stringify([]),
        category: "Accessories",
        condition: "Dead Stock",
      },
      {
        name: "PS2 Fat Console — Refurbished, Cleaned & Tested",
        description:
          "Original PlayStation 2 Fat model, professionally refurbished in Delhi. Each unit has been cleaned, laser replaced if needed, and fully tested. Great for gaming or retro setups.\n\nIncludes:\n- 1x PS2 Fat Console\n- 1x DualShock 2 Controller (used)\n- 1x AV cable\n- 1x Power cable\n- 90-day seller warranty\n\nNote: Units may show minor cosmetic wear but are fully functional.",
        price: 3299,
        stock: 7,
        images: JSON.stringify([]),
        category: "Console",
        condition: "Refurbished",
      },
    ],
  });

  const count = await prisma.product.count();
  console.log(`Seeded ${count} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    sqlite.close();
  });
