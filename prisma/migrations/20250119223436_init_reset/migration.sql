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
