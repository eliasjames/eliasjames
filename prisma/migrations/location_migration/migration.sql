/*
  Warnings:

  - Made the column `name` on table `Role` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Role` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Role` required. This step will fail if there are existing NULL values in that column.
  - Made the column `canEditShelter` on table `Role` required. This step will fail if there are existing NULL values in that column.
  - Made the column `canEditAnimal` on table `Role` required. This step will fail if there are existing NULL values in that column.
  - Made the column `canDeleteAnimal` on table `Role` required. This step will fail if there are existing NULL values in that column.
  - Made the column `canCreateTask` on table `Role` required. This step will fail if there are existing NULL values in that column.
  - Made the column `canEditTask` on table `Role` required. This step will fail if there are existing NULL values in that column.
  - Made the column `canAssignTask` on table `Role` required. This step will fail if there are existing NULL values in that column.
  - Made the column `canDeleteTask` on table `Role` required. This step will fail if there are existing NULL values in that column.
  - Made the column `canCreateUser` on table `Role` required. This step will fail if there are existing NULL values in that column.
  - Made the column `canEditUser` on table `Role` required. This step will fail if there are existing NULL values in that column.
  - Made the column `canDeleteUser` on table `Role` required. This step will fail if there are existing NULL values in that column.
  - Made the column `canAccessMedical` on table `Role` required. This step will fail if there are existing NULL values in that column.
  - Made the column `canAccessBehavior` on table `Role` required. This step will fail if there are existing NULL values in that column.
  - Made the column `canAccessAdoption` on table `Role` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "LocationType" ADD VALUE 'TANK';

-- AlterTable
ALTER TABLE "AnimalTask" ADD COLUMN     "locationTaskId" TEXT;

-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "capacity" TEXT,
ADD COLUMN     "shelterId" TEXT,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "type" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Role" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "canEditShelter" SET NOT NULL,
ALTER COLUMN "canEditAnimal" SET NOT NULL,
ALTER COLUMN "canDeleteAnimal" SET NOT NULL,
ALTER COLUMN "canCreateTask" SET NOT NULL,
ALTER COLUMN "canEditTask" SET NOT NULL,
ALTER COLUMN "canAssignTask" SET NOT NULL,
ALTER COLUMN "canDeleteTask" SET NOT NULL,
ALTER COLUMN "canCreateUser" SET NOT NULL,
ALTER COLUMN "canEditUser" SET NOT NULL,
ALTER COLUMN "canDeleteUser" SET NOT NULL,
ALTER COLUMN "canAccessMedical" SET NOT NULL,
ALTER COLUMN "canAccessBehavior" SET NOT NULL,
ALTER COLUMN "canAccessAdoption" SET NOT NULL;

-- AlterTable
ALTER TABLE "UserTask" ADD COLUMN     "locationTaskId" TEXT;

-- CreateTable
CREATE TABLE "LocationTask" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "TaskStatus" NOT NULL,
    "staffId" TEXT,
    "locationId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3),
    "completedByUserId" TEXT,
    "createdByUserId" TEXT,
    "lastUpdatedByUserId" TEXT,

    CONSTRAINT "LocationTask_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LocationTask_locationId_taskId_key" ON "LocationTask"("locationId", "taskId");

-- AddForeignKey
ALTER TABLE "AnimalTask" ADD CONSTRAINT "AnimalTask_locationTaskId_fkey" FOREIGN KEY ("locationTaskId") REFERENCES "LocationTask"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTask" ADD CONSTRAINT "UserTask_locationTaskId_fkey" FOREIGN KEY ("locationTaskId") REFERENCES "LocationTask"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_shelterId_fkey" FOREIGN KEY ("shelterId") REFERENCES "Shelter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationTask" ADD CONSTRAINT "LocationTask_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationTask" ADD CONSTRAINT "LocationTask_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationTask" ADD CONSTRAINT "LocationTask_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
