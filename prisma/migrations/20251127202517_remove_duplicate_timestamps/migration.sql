/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Quotation` table. All the data in the column will be lost.
  - Made the column `reference` on table `Quotation` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Quotation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalAmount" REAL NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "reference" TEXT NOT NULL
);
INSERT INTO "new_Quotation" ("active", "date", "id", "reference", "totalAmount") SELECT "active", "date", "id", "reference", "totalAmount" FROM "Quotation";
DROP TABLE "Quotation";
ALTER TABLE "new_Quotation" RENAME TO "Quotation";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
