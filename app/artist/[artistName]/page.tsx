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

    // @ts-ignore
    return (
        <main>
            <div className={"flex flex-col items-center"}>

                <h1 className={"text-3xl"}>{artist.artistName}</h1>
                <div className={"relative   max-w-[35rem]"}>
                    <Suspense fallback={<div>Chargement...</div>}>
                        <Image alt={artist.artistName}
                               src={`/images/artists/${artist.image}`}
                               className={imageClassname} width={500}
                               height={500}/>
                    </Suspense>
                    <LikeButton artistId={artist.id} userId={userId} isLiked={liked}/>
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
    /*const [artist, setArtist] = useState<any>(null);
    const [genre, setGenre] = useState<any>(null);
    const [events, setEvents] = useState<any>(null);
    const [isLiked, setIsLiked] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [artistAccount, setArtistAccount] = useState(false);
    const [postContent, setPostContent] = useState("");
    const [post, setPost] = useState(null);
    const [characterCount, setCharacterCount] = useState(0);

    const artistName = params.artistName
    const urlArtistAccount = `/api/artists/checkArtistAccount?artistName=${encodeURIComponent(artistName)}`
    const checkAccountArtist = async () => {
        const response = await fetch(urlArtistAccount);
        const data = await response.json();
        setArtistAccount(data)
        setIsLoading(false)
        return data;
    }
    const url = `/api/artists/getArtist?artistName=${encodeURIComponent(artistName)}`;

    const fetchData = async () => {
        const response = await fetch(url);
        const data = await response.json();
        const artistData = data.artist[0]
        const genreData = data.genre;
        const eventsData = data.events;
        const liked = data.like;
        const post = data.post;
        if (liked) {
            setIsLiked(true)
        }
        setPost(post)
        setArtist(artistData);
        setGenre(genreData);
        setEvents(eventsData);
        setIsLoading(false)
    }
    useEffect(() => {
        fetchData();
        checkAccountArtist();
    }, [post]);

    const handleLike = async () => {
        setIsLiked(!isLiked)
        const session = await getSession();
        const response = await axios.post("/api/artists/addLike", {
            params: {artist, session},
        });
    }
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (postContent.length > 350) {
            // Empêcher la soumission si le nombre de caractères dépasse 350
            return;
        }
        const session = await getSession();
        const response = await axios.post("/api/artists/addPost", {
            artist,
            session,
            postContent
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        });
    }

    const imageClassname = 'object-cover w-screen max-h-[35vw]'
    //const imageSrc: string = `/./images/artists/${artist.image}`*/
    /*
    return (<div>
        {isLoading ? (
            <div><p className={"text-center"}>Chargement...</p></div>
        ) : (artist && (
            <div className={"flex flex-col items-center"}>
                <h1 className={"text-3xl"}>{artist.artistName}</h1>
                {genre && (
                    genre.map((genre: any) => (
                        <Link key={genre.nom} href={`/genres/${genre.nom}`}>{genre.nom}</Link>
                    ))
                )}
                {post && (
                    <span className={"py-2 px-4 rounded-md border-gray-950 bg-slate-800 my-4"}>
                        <p>{post.postContent}</p>
                    </span>
                )}
                <div className={"relative   max-w-[35rem]"}>
                    <Image alt={artist.artistName}
                           src={`/./images/artists/${artist.image}`}
                           className={imageClassname} width={500}
                           height={500}/>
                    <div className={"absolute bottom-2 right-2"}>
                        <LikeButton clickEvent={handleLike} isLiked={isLiked}/>
                    </div>
                </div>
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
                {artistAccount && (
                    <div id="post">
                        <form onSubmit={handleSubmit} className={"grid m-8"}>
                            <input
                                type="text"
                                name={postContent}
                                value={postContent}
                                onChange={(e) => {
                                    const content = e.target.value;
                                    setPostContent(content);
                                    setCharacterCount(content.length);
                                }}
                            />
                            <p className={"text-sm justify-end grid"}>{characterCount}/350</p>

                            <input type="submit" className={"bg-slate-800 px-4 py-2"}
                                   disabled={postContent.length > 350}/>

                        </form>
                    </div>
                )}
                {events && (
                    <EventsComing events={events}/>
                )} {!events && <p>Aucun évènement à venir</p>}
            </div>
        ))}
    </div>)
    */

}