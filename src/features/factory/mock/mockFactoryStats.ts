import type { FactoryRow } from "../types/factoryType";

export const mockFactoryList: FactoryRow[] = Array.from(
  { length: 50 },
  (_, index): FactoryRow => {
    const num = index + 1;

    return {
      id: `NEX - ${String(num).padStart(4, "0")}`,
      serial: `NEX - ${String(num).padStart(4, "0")}`,
      imei: `9384739274921${String(1000 + num).padStart(4, "0")}`,
      linkedOn: new Date(
        2026,
        3, // April
        (num % 30) + 1,
        8 + (num % 10),
        (num * 7) % 60
      ).toISOString(),
      generatedOn: new Date(
        2026,
        3, // April
        (num % 30) + 1,
        8 + (num % 10),
        (num * 7) % 60
      ).toISOString(),
      status: index % 4 !== 1 ? "linked": "unlinked",
      prefix: index % 4 !== 1 ? "NEX": "UPD",
    };
  }
);