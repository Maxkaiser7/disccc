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
import {response} from "express";
import LikeButton from "@/app/components/LikeButton";
import {BsInstagram, BsSpotify, BsTwitter, BsTiktok} from "react-icons/bs";
import {FaSoundcloud} from "react-icons/fa";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";

interface Props {
    params: { artistName: string };
    searchParams: { [key: string]: string | string[] | undefined };
}

export default function ArtistPage<Props>({params}: {
    params: { artistName: string };
    artistData: any;
    genreData: any;
    eventsData: any;
    liked: boolean;
}) {
    const [artist, setArtist] = useState<any>(null);
    const [genre, setGenre] = useState<any>(null);
    const [events, setEvents] = useState<any>(null);
    const [isLiked, setIsLiked] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const artistName = params.artistName
    const url = `/api/artists/getArtist?artistName=${encodeURIComponent(artistName)}`;

    const fetchData = async () => {
        const response = await fetch(url);
        const data = await response.json();
        const artistData = data.artist[0]
        const genreData = data.genre;
        const eventsData = data.events;
        const liked = data.like
        if (liked) {
            setIsLiked(true)
        }
        setArtist(artistData);
        setGenre(genreData);
        setEvents(eventsData);
        setIsLoading(false)
    }
    useEffect(() => {
        fetchData();
    }, []);

    const handleLike = async () => {
        setIsLiked(!isLiked)
        const session = await getSession();
        const response = await axios.post("/api/artists/addLike", {
            params: {artist, session},
        });
    }
    console.log(artist)
    return (<div>
        {isLoading ? (
            <div>Chargement...</div>
        ) : (artist && (
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
                    <div className={"absolute bottom-2 right-2"}>
                        <LikeButton clickEvent={handleLike} isLiked={isLiked}/>
                    </div>
                </div>
                <p className={"text-xl mt-3"}>{artist.description}</p>
                <div id={"socials"} className={"grid grid-cols-2 gap-4 w-full mt-4"}>
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
                    <EventsComing events={events}/>
                )} {!events && <p>Aucun évènement à venir</p>}
            </div>
        ))}
    </div>)
}