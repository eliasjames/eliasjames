/*
  Warnings:

  - You are about to drop the column `taskCategory` on the `Task` table. All the data in the column will be lost.
  - Added the required column `frequency` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TaskFrequency" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "TaskAssignment" AS ENUM ('ALL_ANIMALS', 'ALL_DOGS', 'ALL_CATS', 'ALL_OTHERS');

-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('INTAKE', 'GENERAL_CARE', 'MEDICAL', 'BEHAVIORAL', 'ADOPTION', 'ADMIN', 'OTHER');

-- AlterTable
ALTER TABLE "Task" 
DROP COLUMN "taskCategory",
ADD COLUMN "assignment" "TaskAssignment"[] DEFAULT ARRAY['ALL_ANIMALS']::"TaskAssignment"[], -- Default value for `assignment`
ADD COLUMN "frequency" "TaskFrequency" NOT NULL DEFAULT 'DAILY', -- Default for required `frequency`
ADD COLUMN "roleRestrictions" TEXT[] DEFAULT NULL, -- Nullable initially
ADD COLUMN "staffRestrictions" TEXT[] DEFAULT NULL, -- Nullable initially
ADD COLUMN "type" "TaskType"[] DEFAULT ARRAY['GENERAL_CARE']::"TaskType"[]; -- Default value for `type`
