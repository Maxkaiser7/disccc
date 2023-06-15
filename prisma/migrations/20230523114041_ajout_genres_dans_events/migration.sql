/*
  Warnings:

  - Added the required column `genresId` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "genresId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_genresId_fkey" FOREIGN KEY ("genresId") REFERENCES "Genres"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
