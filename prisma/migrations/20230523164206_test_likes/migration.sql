-- DropForeignKey
ALTER TABLE "Likes" DROP CONSTRAINT "Likes_songsId_fkey";

-- AlterTable
ALTER TABLE "Likes" ALTER COLUMN "songsId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_songsId_fkey" FOREIGN KEY ("songsId") REFERENCES "Songs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
