import {useState, useEffect} from "react";
import prisma from "@/prisma/client";


export default async function GetArtists() {

    const artists = await prisma.artist.findMany()
    return (
        <div>
            <h1>Derniers artistes inscrits</h1>
            {artists.length === 0 ? (
                <p>Aucun artiste à afficher pour le moment.</p>
            ) : (
                artists.map((artist) => (
                    <div key={artist.id} className={'flex flex-col items-center'}>
                        <h2>{artist.artistName}</h2>
                        <div className={'w-96 h-96 '}>
                            <img src={`../images/artists/${artist.image}`} alt={`photo ${artist.artistName}`} className={'w-full h-full object-cover'}/>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}