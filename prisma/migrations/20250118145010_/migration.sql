-- AlterTable
ALTER TABLE "AnimalTask" ADD COLUMN     "completedByUserId" TEXT,
ADD COLUMN     "createdByUserId" TEXT,
ADD COLUMN     "lastUpdatedByUserId" TEXT;
