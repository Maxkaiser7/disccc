/*
  Warnings:

  - You are about to drop the column `Address` on the `Event` table. All the data in the column will be lost.
  - Added the required column `genresId` to the `Artist` table without a default value. This is not possible if the table is not empty.
  - Made the column `image` on table `Artist` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `address` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Artist" ADD COLUMN     "description" TEXT,
ADD COLUMN     "genresId" TEXT NOT NULL,
ALTER COLUMN "image" SET NOT NULL;

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "Address",
ADD COLUMN     "address" JSONB NOT NULL;

-- CreateTable
CREATE TABLE "Genres" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,

    CONSTRAINT "Genres_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Artist" ADD CONSTRAINT "Artist_genresId_fkey" FOREIGN KEY ("genresId") REFERENCES "Genres"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
