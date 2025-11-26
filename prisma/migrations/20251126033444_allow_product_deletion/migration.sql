-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SaleItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "quantity" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "productId" INTEGER,
    "saleId" INTEGER NOT NULL,
    CONSTRAINT "SaleItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "SaleItem_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SaleItem" ("id", "price", "productId", "quantity", "saleId") SELECT "id", "price", "productId", "quantity", "saleId" FROM "SaleItem";
DROP TABLE "SaleItem";
ALTER TABLE "new_SaleItem" RENAME TO "SaleItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
