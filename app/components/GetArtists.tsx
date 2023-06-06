"use client"
import {useState, useEffect} from "react";
import prisma from "@/prisma/client";
import axios from "axios";
import {set} from "zod";
import Link from "next/link";
import ArtistCard from "@/app/components/Cards/ArtistCard";


export default function GetArtists() {
    const [artists, setArtists] = useState([]);
    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const response = await axios.get("/api/artists/getArtists", {
                    headers: {
                        "Content-Type": "application/json",
                    }
                })
                setArtists(response.data)
            } catch (err) {
                console.log(err);
            }
        };
        fetchArtists();
    }, []);
    return (
        <div className={"mt-10"}>
            <h2 className={"text-3xl"}>Derniers artistes inscrits</h2>
            {artists.length === 0 ? (
                <p>Aucun artiste à afficher pour le moment.</p>
            ) : (
                artists.map((artist) => (
                    <ArtistCard artist={artist}/>
                ))
            )}
        </div>
    )
}