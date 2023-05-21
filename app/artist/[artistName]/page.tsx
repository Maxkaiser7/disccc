"use client"
import prisma from "@/prisma/client";
import {useEffect, useState} from "react";
import axios from "axios";
import localFont from "next/dist/compiled/@next/font/dist/local";

export default function ArtistPage({
                                       params,
                                       searchParams,
                                   }: {
    params: { artistName: string };
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const [artist, setArtist] = useState<any>(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const { artistName } = params;
                const response = await axios.get("/api/artists/getArtist", {
                    params: { artistName },
                });
                const artistData = response.data[0];
                setArtist(artistData)
            } catch (error) {
                console.error("Erreur lors de la récupération de l'artiste", error);
            }
        };

        fetchData();
    }, [params.artistName]);

    console.log(artist)
    return <div>
        {artist && (
            <div className={"flex flex-col items-center"}>
                <h1 className={"text-3xl"}>{artist.artistName}</h1>
                <img src={`../images/artists/${artist.image}`} alt={`photo ${artist.artistName}`}
                     className={'object-cover w-screen h-[70vw]'}/>
                <p>{artist.description}</p>
            </div>
        )}
    </div>
}