"use client"
import React, {FormEvent, useEffect, useState} from "react";
import {AiOutlineSearch} from "react-icons/ai"
import ArtistCard from "@/app/components/Cards/ArtistCard";
import prisma from "@/prisma/client";
import axios from "axios";

export default function SearchArtist(props: string) {
    const [searchArtist, setSearchArtist] = useState("");
    const [resultArtists, setResultArtists] = useState([]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData();
        formData.append("artistName", searchArtist)
        try {
            const response = await axios.post("/api/artists/searchArtists", formData, {
                headers: {
                    "Content-Type": "application/json",
                }
            })
            if (response.data === "Nous n'avons trouvé aucun artiste") {
                setResultArtists([]);
                const messageNoFound = response.data
            } else {
                setResultArtists(response.data);
            }        } catch {
            console.log("Il y a eu une erreur lors de la recherche")
        }
    }
    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const response = await axios.get("/api/artists/getArtists");
                setResultArtists(response.data);
            } catch {
                console.log("Il y a eu une erreur lors de la récupération des artistes");
            }
        };

        fetchArtists();
    }, []);
    return (
        <div>
            <form onSubmit={handleSubmit} className={"flex"}>
                <input type="text"
                       placeholder={"Recherchez un artiste..."}
                       value={searchArtist}
                       onChange={(e) => {
                           setSearchArtist(e.target.value)
                       }}
                       className={"h-10"}
                />
                <button
                    type={"submit"}
                    className={"bg-gray-800 px-4 py-2 h-10 disabled:opacity-20"}
                >
                    <AiOutlineSearch/>
                </button>
            </form>
            <ul>
                {resultArtists.length === 0 ? (
                    <p>Nous n'avons trouvé aucun artiste</p>
                ) : (
                    resultArtists.map((artist: object) => <ArtistCard artist={artist} />)
                )}
            </ul>
        </div>
    )
}