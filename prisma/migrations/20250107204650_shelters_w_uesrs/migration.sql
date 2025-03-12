-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_shelterId_fkey";

-- CreateTable
CREATE TABLE "_ShelterUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ShelterUsers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ShelterUsers_B_index" ON "_ShelterUsers"("B");

-- AddForeignKey
ALTER TABLE "_ShelterUsers" ADD CONSTRAINT "_ShelterUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Shelter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShelterUsers" ADD CONSTRAINT "_ShelterUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
