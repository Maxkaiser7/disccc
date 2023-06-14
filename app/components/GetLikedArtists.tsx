import prisma from "@/prisma/client";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import ArtistCard from "@/app/components/Cards/ArtistCard";
import OrganisationCard from "@/app/components/Cards/OrganisationCard";

export default async function getLikedArtists(){
    const session = await getServerSession(authOptions)

    //trouver les artist que l'utilisateur a like
    const likes = await prisma.likes.findMany({
        where: {
            User: {
                email: session?.user?.email
            },
            type: "artist"
        }
    })
    if (likes.length > 0) {
        const artistsLiked = await prisma.artist.findMany({
            where: {
                id: {
                    in: likes.map((like) => like.artistId),
                }
            }
        })
    } else {
        return <p>Vous n'avez pas en</p>
    }

    return (
        <>
            {artistsLiked && artistsLiked.length > 0 && (
                <>
                    <h2 className="mt-4 text-2xl">Vos artistes likés</h2>
                    <div className="flex gap-4 overflow-x-scroll justify-center-center">
                        {artistsLiked.map((artist) => (
                            <ArtistCard artist={artist} key={artist.id} overflow={false} />
                        ))}
                    </div>
                </>
            )}

            {artistsLiked && artistsLiked.length > 1 && (
                <>
                    <h2>Vos artistes likés</h2>
                    <div className="flex gap-4 overflow-x-scroll justify-center">
                        {artistsLiked.map((artist) => (
                            <ArtistCard artist={artist} key={artist.id} overflow={true} />
                        ))}
                    </div>
                </>
            )}
        </>
    );

}