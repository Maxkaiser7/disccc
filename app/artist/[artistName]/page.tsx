import prisma from "@/prisma/client";
import {Suspense} from "react";
import Link from "next/link";
import EventsComing from "@/app/components/EventsComing";
import LikeButton from "@/app/components/LikeButton";
import {BsInstagram, BsSpotify, BsTiktok, BsTwitter} from "react-icons/bs";
import {FaSoundcloud} from "react-icons/fa";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import Image from "next/image";
import {Prisma} from "@prisma/client";
import GenreCard from "@/app/components/Cards/GenreCard";
export const dynamic = 'force-dynamic'

interface Props {
    params: { artistName: string };
    searchParams: { [key: string]: string | string[] | undefined };
}
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
    endPromotion: string | null;
}
interface user {
    id: string;
    email: string;
}
interface events {
    id: string;
    artistId: string;
}
type EventsComingProps = {
    events: Event[];
}
export default async function ArtistPage({params}: Props) {

    const artistName = params.artistName
    const urlArtistAccount = `/api/artists/checkArtistAccount?artistName=${encodeURIComponent(artistName)}`

    const artistData: Prisma.PrismaPromise<unknown> = prisma.$queryRaw`
      SELECT * FROM "Artist"
      WHERE LOWER(REPLACE("artistName", ' ', '')) = LOWER(REPLACE(${artistName}, ' ', ''))
    `;
    const artistArray: any = await artistData;
    const artist = artistArray[0]

    const genreData: Prisma.PrismaPromise<unknown> = prisma.genres.findMany({
        where: {
            id: artist.genresId
        }
    })
    const genres: any = await genreData

    const eventsData: Prisma.PrismaPromise<unknown> = prisma.event.findMany({
        where: {
            artistId: artist.id
        }
    })
    const events: any = await eventsData
    const imageClassname = 'object-cover w-screen max-h-[35vw]'

    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    if(userEmail){
        const user = prisma.user.findUnique({
            where: {
                email: userEmail
            }
        })
    }
    let user;
    const userArray:any = await user
    const userId = userArray?.id

    const like: Prisma.PrismaPromise<unknown> = prisma.likes.findFirst({
        where: {
            userId: userId,
            artistId: artist.id
        }
    });
    let liked: boolean = false

    const likeArray = await like
    liked = !!likeArray;
    const isExternalImage: any = artist?.image?.startsWith("http");

    // @ts-ignore
    return (
        <main>
            <div className={"flex flex-col items-center"}>
                <h1 className={"text-3xl"}>{artist.artistName}</h1>
                <div className={"relative   max-w-[35rem]"}>
                    <Suspense fallback={<div>Chargement...</div>}>
                        {isExternalImage && (<img src={artist?.image} alt={artist?.artistName} className={imageClassname}/>)}
                        {!isExternalImage && (<Image alt={artist.artistName}
                                                      src={`/images/artists/${artist.image}`}
                                                      className={imageClassname} width={500}
                                                      height={500}/>)}
                    </Suspense>
                    <div className={"absolute bottom-0 right-2"}>
                        <LikeButton artistId={artist.id} userId={userId} isLiked={liked}/>
                    </div>
                </div>
                <span>
                    {genres.length > 0 && genres.map((genre: { id: string, nom: string }) => <GenreCard
                        genre={genre}/>)}
                </span>
                <p className={"text-xl mt-3 md:w-6/12 w-9/12"}>{artist.description}</p>
                <div id={"socials"} className={"grid grid-cols-2 gap-4 mt-4 width-12 items-center"}>
                    {artist.instagramLink && (
                        <span className={"flex items-center gap-2"}>
                        <BsInstagram/>
                        <Link href={`${artist.instagram}`}>Instagram</Link>
                    </span>
                    )}
                    {artist.spotifyLink && (
                        <span className={"flex items-center gap-2"}>
                        <BsSpotify/>
                        <Link href={`${artist.spotifyLink}`}>Spotify</Link>
                    </span>
                    )}
                    {artist.soundcloudLink && (
                        <span className={"flex items-center gap-2"}>
                        <FaSoundcloud/>
                        <Link href={`${artist.soundcloudLink}`}>Soundcloud</Link>
                    </span>
                    )}
                    {artist.youtubeLink && (
                        <span className={"flex items-center gap-2"}>
                            <Link href={"https://youtube.com"}>Youtube</Link>
                        </span>
                    )}
                    {artist.twitterLink && (
                        <span className={"flex items-center gap-2"}>
                            <BsTwitter/>
                            <Link href={`${artist.twitterLink}`}>Twitter</Link>
                        </span>
                    )}
                    {artist.tiktokLink && (
                        <span className={"flex items-center gap-2"}>
                            <BsTiktok/>
                            <Link href={`${artist.tiktokLink}`}>TikTok</Link>
                        </span>
                    )}
                </div>
                {events && (
                    // @ts-ignore
                    <EventsComing events={events}/>
                )} {!events && <p>Aucun évènement à venir</p>}
            </div>
        </main>
    )
}