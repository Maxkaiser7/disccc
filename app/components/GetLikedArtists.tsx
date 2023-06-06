import prisma from "@/prisma/client";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import ArtistCard from "@/app/components/Cards/ArtistCard";

export default async function getLikedArtists(){
    const session = await getServerSession(authOptions)

    //trouver les évenements que l'utilisateur a like
    const likes = await prisma.likes.findMany({
        where: {
            User: {
                email: session?.user?.email
            },
            type: "artist"
        }
    })
    const artistsLiked = await prisma.artist.findMany({
        where: {
            id: {
                in: likes.map(like => like.artistId)
            }
        }
    })
    return(
        <>
        {artistsLiked.length > 0 && (
            <>
                <h2>Vos artistes likés</h2>
                <div className={"flex gap-4 overflow-x-scroll"}>
                    {artistsLiked.map(artist => <ArtistCard artist={artist} key={artist.id} overflow={true}/>)}
                </div>
            </>
        )}
        </>
    )
}