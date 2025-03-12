/*
  Warnings:

  - You are about to drop the `ShelterRoles` table. If the table is not empty, all the data it contains will be lost.
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
  - Made the column `canAccessAdoption` on table `ShelterUser` required. This step will fail if there are existing NULL values in that column.
  - Made the column `canAccessBehavior` on table `ShelterUser` required. This step will fail if there are existing NULL values in that column.
  - Made the column `canAccessMedical` on table `ShelterUser` required. This step will fail if there are existing NULL values in that column.
  - Made the column `canAssignTask` on table `ShelterUser` required. This step will fail if there are existing NULL values in that column.
  - Made the column `canCreateTask` on table `ShelterUser` required. This step will fail if there are existing NULL values in that column.
  - Made the column `canCreateUser` on table `ShelterUser` required. This step will fail if there are existing NULL values in that column.
  - Made the column `canDeleteAnimal` on table `ShelterUser` required. This step will fail if there are existing NULL values in that column.
  - Made the column `canDeleteTask` on table `ShelterUser` required. This step will fail if there are existing NULL values in that column.
  - Made the column `canDeleteUser` on table `ShelterUser` required. This step will fail if there are existing NULL values in that column.
  - Made the column `canEditAnimal` on table `ShelterUser` required. This step will fail if there are existing NULL values in that column.
  - Made the column `canEditShelter` on table `ShelterUser` required. This step will fail if there are existing NULL values in that column.
  - Made the column `canEditTask` on table `ShelterUser` required. This step will fail if there are existing NULL values in that column.
  - Made the column `canEditUser` on table `ShelterUser` required. This step will fail if there are existing NULL values in that column.
  - Made the column `roleId` on table `ShelterUser` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ShelterRoles" DROP CONSTRAINT "ShelterRoles_roleId_fkey";

-- DropForeignKey
ALTER TABLE "ShelterRoles" DROP CONSTRAINT "ShelterRoles_shelterId_fkey";

-- AlterTable
ALTER TABLE "Role" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "canEditShelter" SET NOT NULL,
ALTER COLUMN "canEditShelter" SET DEFAULT false,
ALTER COLUMN "canEditAnimal" SET NOT NULL,
ALTER COLUMN "canEditAnimal" SET DEFAULT false,
ALTER COLUMN "canDeleteAnimal" SET NOT NULL,
ALTER COLUMN "canDeleteAnimal" SET DEFAULT false,
ALTER COLUMN "canCreateTask" SET NOT NULL,
ALTER COLUMN "canCreateTask" SET DEFAULT false,
ALTER COLUMN "canEditTask" SET NOT NULL,
ALTER COLUMN "canEditTask" SET DEFAULT false,
ALTER COLUMN "canAssignTask" SET NOT NULL,
ALTER COLUMN "canAssignTask" SET DEFAULT false,
ALTER COLUMN "canDeleteTask" SET NOT NULL,
ALTER COLUMN "canDeleteTask" SET DEFAULT false,
ALTER COLUMN "canCreateUser" SET NOT NULL,
ALTER COLUMN "canCreateUser" SET DEFAULT false,
ALTER COLUMN "canEditUser" SET NOT NULL,
ALTER COLUMN "canEditUser" SET DEFAULT false,
ALTER COLUMN "canDeleteUser" SET NOT NULL,
ALTER COLUMN "canDeleteUser" SET DEFAULT false,
ALTER COLUMN "canAccessMedical" SET NOT NULL,
ALTER COLUMN "canAccessMedical" SET DEFAULT false,
ALTER COLUMN "canAccessBehavior" SET NOT NULL,
ALTER COLUMN "canAccessBehavior" SET DEFAULT false,
ALTER COLUMN "canAccessAdoption" SET NOT NULL,
ALTER COLUMN "canAccessAdoption" SET DEFAULT false;

-- AlterTable
ALTER TABLE "ShelterUser" ALTER COLUMN "canAccessAdoption" SET NOT NULL,
ALTER COLUMN "canAccessAdoption" SET DEFAULT false,
ALTER COLUMN "canAccessBehavior" SET NOT NULL,
ALTER COLUMN "canAccessBehavior" SET DEFAULT false,
ALTER COLUMN "canAccessMedical" SET NOT NULL,
ALTER COLUMN "canAccessMedical" SET DEFAULT false,
ALTER COLUMN "canAssignTask" SET NOT NULL,
ALTER COLUMN "canAssignTask" SET DEFAULT false,
ALTER COLUMN "canCreateTask" SET NOT NULL,
ALTER COLUMN "canCreateTask" SET DEFAULT false,
ALTER COLUMN "canCreateUser" SET NOT NULL,
ALTER COLUMN "canCreateUser" SET DEFAULT false,
ALTER COLUMN "canDeleteAnimal" SET NOT NULL,
ALTER COLUMN "canDeleteAnimal" SET DEFAULT false,
ALTER COLUMN "canDeleteTask" SET NOT NULL,
ALTER COLUMN "canDeleteTask" SET DEFAULT false,
ALTER COLUMN "canDeleteUser" SET NOT NULL,
ALTER COLUMN "canDeleteUser" SET DEFAULT false,
ALTER COLUMN "canEditAnimal" SET NOT NULL,
ALTER COLUMN "canEditAnimal" SET DEFAULT false,
ALTER COLUMN "canEditShelter" SET NOT NULL,
ALTER COLUMN "canEditShelter" SET DEFAULT false,
ALTER COLUMN "canEditTask" SET NOT NULL,
ALTER COLUMN "canEditTask" SET DEFAULT false,
ALTER COLUMN "canEditUser" SET NOT NULL,
ALTER COLUMN "canEditUser" SET DEFAULT false,
ALTER COLUMN "roleId" SET NOT NULL;

-- DropTable
DROP TABLE "ShelterRoles";

-- CreateTable
CREATE TABLE "ShelterRole" (
    "id" TEXT NOT NULL,
    "shelterId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShelterRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShelterUserInvite" (
    "id" TEXT NOT NULL,
    "shelterId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "shelterUserId" TEXT,
    "token" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShelterUserInvite_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ShelterRole" ADD CONSTRAINT "ShelterRole_shelterId_fkey" FOREIGN KEY ("shelterId") REFERENCES "Shelter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShelterRole" ADD CONSTRAINT "ShelterRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShelterUserInvite" ADD CONSTRAINT "ShelterUserInvite_shelterId_fkey" FOREIGN KEY ("shelterId") REFERENCES "Shelter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShelterUserInvite" ADD CONSTRAINT "ShelterUserInvite_shelterUserId_fkey" FOREIGN KEY ("shelterUserId") REFERENCES "ShelterUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
