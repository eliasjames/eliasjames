/*
  Warnings:

  - You are about to drop the `AnimaTask` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AnimaTask" DROP CONSTRAINT "AnimaTask_animalId_fkey";

-- DropForeignKey
ALTER TABLE "AnimaTask" DROP CONSTRAINT "AnimaTask_staffId_fkey";

-- DropForeignKey
ALTER TABLE "AnimaTask" DROP CONSTRAINT "AnimaTask_taskId_fkey";

-- DropTable
DROP TABLE "AnimaTask";

-- CreateTable
CREATE TABLE "AnimalTask" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "TaskStatus" NOT NULL,
    "staffId" TEXT NOT NULL,
    "animalId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnimalTask_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AnimalTask" ADD CONSTRAINT "AnimalTask_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimalTask" ADD CONSTRAINT "AnimalTask_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimalTask" ADD CONSTRAINT "AnimalTask_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
