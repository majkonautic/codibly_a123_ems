/*
  Warnings:

  - You are about to drop the `assets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `assetId` on the `alerts` table. All the data in the column will be lost.
  - You are about to drop the column `assetId` on the `performance` table. All the data in the column will be lost.
  - Added the required column `category` to the `alerts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `containerId` to the `alerts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `containerId` to the `performance` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "assets";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "battery_containers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "capacity" REAL NOT NULL,
    "location" TEXT NOT NULL,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'offline',
    "soc" REAL NOT NULL,
    "soh" REAL NOT NULL,
    "cycleCount" INTEGER NOT NULL,
    "productModel" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "voltageClass" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_alerts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "containerId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "alerts_containerId_fkey" FOREIGN KEY ("containerId") REFERENCES "battery_containers" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_alerts" ("createdAt", "id", "isRead", "message", "severity", "type") SELECT "createdAt", "id", "isRead", "message", "severity", "type" FROM "alerts";
DROP TABLE "alerts";
ALTER TABLE "new_alerts" RENAME TO "alerts";
CREATE TABLE "new_performance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "containerId" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "generation" REAL NOT NULL,
    "availability" REAL NOT NULL,
    "efficiency" REAL NOT NULL,
    CONSTRAINT "performance_containerId_fkey" FOREIGN KEY ("containerId") REFERENCES "battery_containers" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_performance" ("availability", "efficiency", "generation", "id", "timestamp") SELECT "availability", "efficiency", "generation", "id", "timestamp" FROM "performance";
DROP TABLE "performance";
ALTER TABLE "new_performance" RENAME TO "performance";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "battery_containers_serialNumber_key" ON "battery_containers"("serialNumber");
