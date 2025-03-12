/*
  Warnings:

  - You are about to drop the column `age` on the `Animal` table. All the data in the column will be lost.
  - You are about to drop the column `imageSrc` on the `Animal` table. All the data in the column will be lost.
  - The `species` column on the `Animal` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[animalId,taskId]` on the table `AnimalTask` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `biography` to the `Animal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateOfBirth` to the `Animal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `intakeCategory` to the `Animal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `intakeDate` to the `Animal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sex` to the `Animal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spayNeuterStatus` to the `Animal` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Species" AS ENUM ('DOG', 'CAT', 'RABBIT', 'BIRD', 'HAMSTER', 'GUINEA_PIG', 'RAT', 'REPTILE', 'OTHER');

-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "IntakeCategory" AS ENUM ('STRAY', 'SURRENDER', 'TRANSFER', 'BORN_IN_SHELTER', 'RETURN', 'OTHER');

-- CreateEnum
CREATE TYPE "OutcomeCategory" AS ENUM ('ADOPTION', 'RETURN', 'TRANSFER', 'MEDICAL_EUTHANASIA', 'BEHAVIORAL_EUTHANASIA', 'CAPACITY_EUTHANASIA', 'OTHER_EUTHANASIA', 'OTHER');

-- CreateEnum
CREATE TYPE "PlacementInfo" AS ENUM ('GOOD_WITH_DOGS', 'GOOD_WITH_CATS', 'GOOD_WITH_KIDS', 'GOOD_WITH_OTHER_ANIMALS', 'HOUSETRAINED', 'CRATE_TRAINED', 'LEASH_TRAINED', 'SPECIAL_NEEDS', 'HIGH_ENERGY');

-- AlterEnum
ALTER TYPE "TaskFrequency" ADD VALUE 'ONE_TIME';

-- DropForeignKey
ALTER TABLE "AnimalTask" DROP CONSTRAINT "AnimalTask_animalId_fkey";

-- AlterTable
ALTER TABLE "Animal" DROP COLUMN "age",
DROP COLUMN "imageSrc",
ADD COLUMN     "biography" TEXT NOT NULL,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "imageSrcs" TEXT[],
ADD COLUMN     "intakeCategory" "IntakeCategory" NOT NULL,
ADD COLUMN     "intakeDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "outcomeCategory" "OutcomeCategory",
ADD COLUMN     "outcomeDate" TIMESTAMP(3),
ADD COLUMN     "placementInfo" "PlacementInfo"[],
ADD COLUMN     "primaryImageSrc" TEXT,
ADD COLUMN     "sex" "Sex" NOT NULL,
ADD COLUMN     "spayNeuterStatus" BOOLEAN NOT NULL,
DROP COLUMN "species",
ADD COLUMN     "species" "Species" NOT NULL DEFAULT 'OTHER';

-- AlterTable
ALTER TABLE "AnimalTask" ADD COLUMN     "dueDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "dueDate" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Flag" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Flag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnimalFlag" (
    "id" TEXT NOT NULL,
    "animalId" TEXT NOT NULL,
    "flagId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnimalFlag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnimalEvent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "animalId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnimalEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "animalId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicalItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BehaviorItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "animalId" TEXT,

    CONSTRAINT "BehaviorItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BehaviorEvent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "animalId" TEXT,

    CONSTRAINT "BehaviorEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AnimalTask_animalId_taskId_key" ON "AnimalTask"("animalId", "taskId");

-- AddForeignKey
ALTER TABLE "AnimalTask" ADD CONSTRAINT "AnimalTask_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimalFlag" ADD CONSTRAINT "AnimalFlag_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimalFlag" ADD CONSTRAINT "AnimalFlag_flagId_fkey" FOREIGN KEY ("flagId") REFERENCES "Flag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimalEvent" ADD CONSTRAINT "AnimalEvent_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalItem" ADD CONSTRAINT "MedicalItem_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BehaviorItem" ADD CONSTRAINT "BehaviorItem_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BehaviorEvent" ADD CONSTRAINT "BehaviorEvent_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
