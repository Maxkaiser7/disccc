import prisma from "@/prisma/client";
import Link from "next/link";
import ArtistCard from "@/app/components/Cards/ArtistCard";
export const dynamic = 'force-dynamic'
export default async function Page({
                                 params,
                                 searchParams,
                             }: {
    params: { nom: string };
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const genre =await prisma.genres.findFirst({
        where: {
            nom: params.nom,
        },
    })
    const artists = await prisma.artist.findMany({
        where: {
            genresId:genre?.id,
        },
    })
    /*const events = await prisma.event.findMany({
        where: {
            genresId:genre.id,
        }
    })*/
    return <div className={"flex flex-col items-center"}>
        <h1 className={"text-3xl"}>{params.nom}</h1>
        <h2>Artistes</h2>
        {artists.length === 0 ? (
            <p>Aucun artiste à afficher pour le moment.</p>
        ) : (
            artists.map((artist : any) => (
                <ArtistCard overflow={false} artist={artist}/>
            ))
        )}
    </div>;
}