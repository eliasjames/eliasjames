/*
  Warnings:

  - You are about to drop the column `permissions` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - Added the required column `canAccessAdoption` to the `ShelterUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `canAccessBehavior` to the `ShelterUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `canAccessMedical` to the `ShelterUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `canAssignTask` to the `ShelterUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `canCreateTask` to the `ShelterUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `canCreateUser` to the `ShelterUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `canDeleteAnimal` to the `ShelterUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `canDeleteTask` to the `ShelterUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `canDeleteUser` to the `ShelterUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `canEditAnimal` to the `ShelterUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `canEditShelter` to the `ShelterUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `canEditTask` to the `ShelterUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `canEditUser` to the `ShelterUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleId` to the `ShelterUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ShelterUser" ADD COLUMN     "canAccessAdoption" BOOLEAN NOT NULL,
ADD COLUMN     "canAccessBehavior" BOOLEAN NOT NULL,
ADD COLUMN     "canAccessMedical" BOOLEAN NOT NULL,
ADD COLUMN     "canAssignTask" BOOLEAN NOT NULL,
ADD COLUMN     "canCreateTask" BOOLEAN NOT NULL,
ADD COLUMN     "canCreateUser" BOOLEAN NOT NULL,
ADD COLUMN     "canDeleteAnimal" BOOLEAN NOT NULL,
ADD COLUMN     "canDeleteTask" BOOLEAN NOT NULL,
ADD COLUMN     "canDeleteUser" BOOLEAN NOT NULL,
ADD COLUMN     "canEditAnimal" BOOLEAN NOT NULL,
ADD COLUMN     "canEditShelter" BOOLEAN NOT NULL,
ADD COLUMN     "canEditTask" BOOLEAN NOT NULL,
ADD COLUMN     "canEditUser" BOOLEAN NOT NULL,
ADD COLUMN     "roleId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "permissions",
DROP COLUMN "role";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,
    "canEditShelter" BOOLEAN NOT NULL,
    "canEditAnimal" BOOLEAN NOT NULL,
    "canDeleteAnimal" BOOLEAN NOT NULL,
    "canCreateTask" BOOLEAN NOT NULL,
    "canEditTask" BOOLEAN NOT NULL,
    "canAssignTask" BOOLEAN NOT NULL,
    "canDeleteTask" BOOLEAN NOT NULL,
    "canCreateUser" BOOLEAN NOT NULL,
    "canEditUser" BOOLEAN NOT NULL,
    "canDeleteUser" BOOLEAN NOT NULL,
    "canAccessMedical" BOOLEAN NOT NULL,
    "canAccessBehavior" BOOLEAN NOT NULL,
    "canAccessAdoption" BOOLEAN NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShelterRoles" (
    "id" TEXT NOT NULL,
    "shelterId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShelterRoles_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ShelterUser" ADD CONSTRAINT "ShelterUser_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShelterRoles" ADD CONSTRAINT "ShelterRoles_shelterId_fkey" FOREIGN KEY ("shelterId") REFERENCES "Shelter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShelterRoles" ADD CONSTRAINT "ShelterRoles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
