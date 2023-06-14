import prisma from "@/prisma/client";
import GenreCard from "@/app/components/Cards/GenreCard";
import {AiOutlineStar, AiFillStar} from "react-icons/ai";
import LikeButton from "@/app/components/LikeButton";
import LikeEventButton from "@/app/components/LikeEventButton";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {session} from "next-auth/core/routes";
import Link from "next/link";
import ArtistCard from "@/app/components/Cards/ArtistCard";
interface Artist {
    id: string;
    artistName: string;
    image: string;
    userId: string;
    createdAt: Date;
    description: string;
    genresId: string;
    soundcloudLink: string | null;
    instagramLink: string | null;
    tiktokLink: string | null;
    twitterLink: string | null;
    appleLink: string | null;
    deezerLink: string | null;
    spotifyLink: string | null;
    isPromoted: boolean;
    endPromotion: string | null; //
}
interface Genre {
    id: string;
    genreName: string;
}
export default async function EventPage({
                                      params,
                                      searchParams,
                                  }: {
    params: { eventId: string };
    searchParams: { [key: string]: string | string[] | undefined };
}) {

    const session = await getServerSession(authOptions);
    const event = await prisma.event.findUnique({
        where: {
            id: params.eventId
        },
    })

    const genres = await prisma.genres.findMany({
        where: {
            Event: {
                some: {
                    id: event?.id,
                },
            },
        },
    })
    const artistOnEvent = await prisma.artistsOnEvents.findMany({
        where: {
            eventId: event?.id
        },
    })
    const artists = await prisma.artist.findMany({
        where: {
            id:{
                in: artistOnEvent.map(artist => artist.artistId)
            }
        }
    })
    //loop artistOnEvent pour récupérer les artistes
    const dateFrom : Date | undefined = event?.dateFrom
    const options: {day: string, month: string} = { day: 'numeric', month: 'long' };
    // @ts-ignore
    const dateStr: string = dateFrom?.toLocaleDateString('fr-FR', options)!;
    const eventAddress: { commune: string, rue: string, cp: string } | undefined = event?.address as { commune: string, rue: string, cp: string } | undefined;
    // @ts-ignore
    const jsonAddress: {commune: string, rue: string, cp: string} = eventAddress?.jsonAdress;
    return (
        <div className={"p8  max-w-[45rem] ml-auto mr-auto"}>
            <h2 className={"text-3xl"}>{event?.name}</h2>
            <p>le {dateStr} à {jsonAddress?.commune} {jsonAddress?.rue}, {jsonAddress?.cp}</p>
            <img src={`../images/events/${event?.image}`} alt={`${event?.name} event`}
                 className={'object-cover w-screen h-60'}/>
            <span className={"flex gap-4 mt-2 text-xl"}>
            {artists.map((artist)=> (
                <Link href={`/artists/${artist.id}`} key={artist.id} className={"bg-violet-900 py-2 px-4 hover:scale-110 duration-75"}>{artist.artistName}</Link>
            ))}
            </span>
            <p>{event?.description}</p>
            {event?.price !== undefined && event.price > 0 ? (
                <p>{event.price}€</p>
            ) : (
                <p>Entrée gratuite</p>
            )}
            <div className={"flex justify-between"}>
                {genres.length > 0 && genres.map((genre: {id: string, nom:string}) => <GenreCard genre={genre}/>)}
                {session && <LikeEventButton eventId={event?.id || ''} />}
            </div>
            {event?.facebookLink && <Link href={`${event?.facebookLink}`}>Lien vers l'évenement Facebook</Link>}

        </div>
    );
}