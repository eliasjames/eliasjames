/*
  Warnings:

  - You are about to drop the column `type` on the `Animal` table. All the data in the column will be lost.
  - You are about to drop the column `animalId` on the `Task` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "AnimalTask" DROP CONSTRAINT "AnimalTask_staffId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_animalId_fkey";

-- AlterTable
ALTER TABLE "Animal" DROP COLUMN "type";

-- AlterTable
ALTER TABLE "AnimalTask" ALTER COLUMN "staffId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "animalId",
ADD COLUMN     "shelterId" TEXT;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_shelterId_fkey" FOREIGN KEY ("shelterId") REFERENCES "Shelter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimalTask" ADD CONSTRAINT "AnimalTask_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;
