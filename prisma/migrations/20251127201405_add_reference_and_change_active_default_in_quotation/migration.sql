-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Quotation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalAmount" REAL NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "reference" TEXT
);
INSERT INTO "new_Quotation" ("active", "date", "id", "totalAmount") SELECT "active", "date", "id", "totalAmount" FROM "Quotation";
DROP TABLE "Quotation";
ALTER TABLE "new_Quotation" RENAME TO "Quotation";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
