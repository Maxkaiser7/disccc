-- AlterTable
ALTER TABLE "Likes" ADD COLUMN     "eventId" TEXT;

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
