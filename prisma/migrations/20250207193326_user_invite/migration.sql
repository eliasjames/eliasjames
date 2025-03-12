/*
  Warnings:

  - You are about to drop the column `role` on the `Staff` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[shelterId,email]` on the table `ShelterUserInvite` will be added. If there are existing duplicate values, this will fail.
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
-- DropForeignKey
ALTER TABLE "ShelterUser" DROP CONSTRAINT "ShelterUser_roleId_fkey";

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
ALTER TABLE "ShelterUser" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isStaff" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isVolunteer" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "roleId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ShelterUserInvite" ADD COLUMN     "canAccessAdoption" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canAccessBehavior" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canAccessMedical" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canAssignTask" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canCreateTask" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canCreateUser" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canDeleteAnimal" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canDeleteTask" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canDeleteUser" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canEditAnimal" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canEditShelter" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canEditTask" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canEditUser" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isStaff" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isVolunteer" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "role";

-- CreateIndex
CREATE UNIQUE INDEX "ShelterUserInvite_shelterId_email_key" ON "ShelterUserInvite"("shelterId", "email");

-- AddForeignKey
ALTER TABLE "ShelterUser" ADD CONSTRAINT "ShelterUser_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;
