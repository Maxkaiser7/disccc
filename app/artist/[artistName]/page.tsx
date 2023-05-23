"use client"
import prisma from "@/prisma/client";
import {useEffect, useState} from "react";
import axios from "axios";
import localFont from "next/dist/compiled/@next/font/dist/local";
import Link from "next/link";
import EventsComing from "@/app/components/EventsComing";
import {AiOutlineHeart, AiFillHeart} from "react-icons/ai";
import {getSession} from "next-auth/react";
import {log} from "util";

export default function ArtistPage({
                                       params,
                                       searchParams,
                                   }: {
    params: { artistName: string };
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const [artist, setArtist] = useState<any>(null);
    const [genre, setGenre] = useState<any>(null);
    const [events, setEvents] = useState<any>(null);
    const [isLiked, setIsLiked] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const { artistName } = params;

                const response = await axios.get("/api/artists/getArtist", {
                    params: { artistName },
                });
                const artistData = response.data.artist[0];
                const genreData = response.data.genre;
                const eventsData = response.data.events;
                const liked = response.data.like
                if (liked) {
                    setIsLiked(true)
                }
                console.log(isLiked)
                setArtist(artistData)
                setGenre(genreData)
                setEvents(eventsData)
            } catch (error) {
                console.error("Erreur lors de la récupération de l'artiste", error);
            }
        };

        fetchData();
    }, [params.artistName]);
    const handleLike = async () => {
        const session = await getSession();

        const response = await axios.post("/api/artists/addLike", {
            params: { artist, session },
        });
        setIsLiked(!isLiked);
    }
    return <div>
        {artist && (
            <div className={"flex flex-col items-center"}>
                <h1 className={"text-3xl"}>{artist.artistName}</h1>
                {genre && (
                    genre.map((genre: any) => (
                        <Link key={genre.nom} href={`/genres/${genre.nom}`}>{genre.nom}</Link>
                    ))
                )}

                <div className={"relative"}>
                    <img src={`../images/artists/${artist.image}`} alt={`photo ${artist.artistName}`}
                         className={'object-cover w-screen h-[70vw]'}/>
                    <button className={"absolute bottom-2 right-2"} onClick={handleLike}>
                        {isLiked ? <AiFillHeart style={{"width": "40px", "height": "40px"}}/> : <AiOutlineHeart style={{"width": "40px", "height": "40px"}}/>}
                    </button>
                </div>
                <p className={"text-xl mt-3"}>{artist.description}</p>
                {events && (
                    <EventsComing events={events} />
                )} {!events && <p>Aucun évènement à venir</p>}

            </div>
        )}
    </div>
}