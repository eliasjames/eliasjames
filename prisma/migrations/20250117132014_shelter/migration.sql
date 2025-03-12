/*
  Warnings:

  - You are about to drop the column `address` on the `Shelter` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Shelter` table. All the data in the column will be lost.
  - Added the required column `addressLine1` to the `Shelter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Shelter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Shelter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Shelter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zipCode` to the `Shelter` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LocationType" AS ENUM ('KENNEL', 'FOSTER', 'CAGE', 'ROOM');

-- AlterTable
ALTER TABLE "Animal" ADD COLUMN     "locationId" TEXT;

-- AlterTable
ALTER TABLE "Shelter" DROP COLUMN "address",
DROP COLUMN "userId",
ADD COLUMN     "addressLine1" TEXT NOT NULL,
ADD COLUMN     "addressLine2" TEXT,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "zipCode" TEXT NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "LocationType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Animal" ADD CONSTRAINT "Animal_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
