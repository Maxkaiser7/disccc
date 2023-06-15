-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "artistId" TEXT,
ADD COLUMN     "unsignedArtists" TEXT;

-- CreateTable
CREATE TABLE "ArtistsOnEvents" (
    "artistId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "ArtistsOnEvents_pkey" PRIMARY KEY ("artistId","eventId")
);

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtistsOnEvents" ADD CONSTRAINT "ArtistsOnEvents_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtistsOnEvents" ADD CONSTRAINT "ArtistsOnEvents_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
