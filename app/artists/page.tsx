import prisma from "@/prisma/client";
import ArtistCard from "@/app/components/Cards/ArtistCard";
import GetLikedArtists from "@/app/components/GetLikedArtists";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {Pagination} from "next-pagination"
import ArtistsPagination from "@/app/components/ArtistsPagination";
export default async function getArtists(context: any){
    const session = await getServerSession(authOptions)
    const page = parseInt(context?.query?.page) || 1;

    const size = 10; // number of results per page
    const skip = (page - 1) * size;
    const artists = await prisma.artist.findMany({
        orderBy: {
            createdAt: "desc",
        },
        skip: skip,
        take: size,
    })
    let user : any = []
    let likes : any = []
    let artistsLiked : any[] = [];

    if (session){
        user = await prisma.user.findUnique({
            where: {
                email: session?.user?.email,
            },
        });
         likes = await prisma.likes.findMany({
            where: {
                userId: user?.id ,
                type: "artist"
            }
        })
        if(likes.length > 0){
            artistsLiked = await prisma.artist.findMany({
                where: {
                    id: {
                        in: likes.map((like) => like.artistId),
                    },
                },
            });
        }
    }


    return (
        <div className={"p-8"}>
            {artistsLiked && artistsLiked.length > 0 && (
                <>
                    <h2 className="mt-4 text-2xl text-center">Vos artistes likés</h2>
                    {artistsLiked.length === 0 && (
                        <p className={"text-center"}>Aucun artiste liké</p>
                    )}
                    <div className="flex gap-4 overflow-x-scroll justify-center">
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
            <h2 className={"text-3xl mb-3 text-center"}>Artistes</h2>

            <ArtistsPagination/>
        </div>
    );
}