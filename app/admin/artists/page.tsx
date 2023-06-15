"use client"
import prisma from "@/prisma/client";
import {useEffect, useState} from "react";
import axios from "axios";
import {BsFillTrashFill} from "react-icons/bs";

export default function adminArtist() {
    const [artists, setArtists] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const revalidate = 0
    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const response = await axios.get("/api/artists/getArtists", {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    params: {
                        page: currentPage,
                        limit: itemsPerPage,
                    },
                })
                setArtists(response.data)
            } catch (err) {
                console.log(err);
            }
        };
        fetchArtists();
    }, [currentPage, itemsPerPage]);
    const deleteArtist = async (artistId: string) => {
        try {
            const confirmed = window.confirm(
                "Êtes-vous sûr de vouloir supprimer cet artiste ?"
            );
            if (confirmed) {
                await axios.post(`/api/artists/deleteArtist/`, {
                    params: { artistId },
                });
                setArtists((prevArtists : any) => {
                    if (Array.isArray(prevArtists)) {
                        return prevArtists.filter((artist) => artist.id !== artistId);
                    }
                    return prevArtists;
                });
            }
        } catch (err) {
            console.log(err);
        }
    };
    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToNextPage = () => {
        setCurrentPage(currentPage + 1);
    };
    const descriptionShort = []

    return (
        <div className={"w-full p-8 overflow-x-auto grid justify-center" }>
            <table className="table-auto border-collapse border-white border text-xs font-light overflow-x-scroll">
                <thead>
                <tr className={"bg-slate-700 "}>
                    <th className="px-4 py-2 whitespace-nowrap">Actions</th>
                    {/* Nouvelle colonne pour les actions */}
                    <th className="px-4 py-2 whitespace-nowrap">artistName</th>
                    <th className="px-4 py-2 whitespace-nowrap">createdAt</th>
                    <th className="px-4 py-2 whitespace-nowrap max-w-xs">description</th>
                    <th className="px-4 py-2 whitespace-nowrap max-w-xs">appleLink</th>
                    <th className="px-4 py-2 whitespace-nowrap">instagramLink</th>
                    <th className="px-4 py-2 whitespace-nowrap">soundcloudLink</th>
                    <th className="px-4 py-2 whitespace-nowrap">tiktokLink</th>
                    <th className="px-4 py-2 whitespace-nowrap">twitterLink</th>
                    <th className="px-4 py-2 whitespace-nowrap">spotifyLink</th>
                    <th className="px-4 py-2 whitespace-nowrap">isPromoted</th>
                </tr>
                </thead>
                <tbody>
                {artists.map((artist : any) => {
                    return (
                        <tr key={artist.id}>
                            <td className="border px-4 py-2 whitespace-nowrap">
                                <button
                                    onClick={() => deleteArtist(artist.id)}
                                >
                                    <BsFillTrashFill/>
                                </button>
                            </td>
                            <td className="border px-4 py-2">{artist.artistName}</td>
                            <td className="border px-4 py-2">
                                {artist.createdAt ? new Date(artist.createdAt).toLocaleDateString() : "N/A"}
                            </td>
                            <td className="border px-4 py-2 whitespace-nowrap max-w-xs">{artist.description ? artist.description.slice(0, 10) + "..." : "N/A"}
                            </td>
                            <td className="border px-4 py-2 whitespace-nowrap max-w-xs">{artist.appleLink ? artist.appleLink.slice(0, 10) + "..." : "N/A"}</td>
                            <td className="border px-4 py-2 whitespace-nowrap">{artist.instagramLink ? artist.instagramLink.slice(0, 10) + "..." : "N/A"}</td>
                            <td className="border px-4 py-2 whitespace-nowrap">{artist.soundcloudLink ? artist.soundcloudLink.slice(0, 10) + "..." : "N/A"}</td>
                            <td className="border px-4 py-2 whitespace-nowrap">{artist.tiktokLink ? artist.tiktokLink.slice(0, 10) + "..." : "N/A"}</td>
                            <td className="border px-4 py-2 whitespace-nowrap">{artist.twitterLink ? artist.twitterLink.slice(0, 10) + "..." : "N/A"}</td>
                            <td className="border px-4 py-2 whitespace-nowrap">{artist.spotifyLink ? artist.spotifyLink.slice(0, 10) + "..." : "N/A"}</td>
                            <td className="border px-4 py-2 whitespace-nowrap">{artist.isPromoted}</td>

                        </tr>
                    );
                })}
                </tbody>
            </table>
            <div>
                <button onClick={goToPreviousPage} disabled={currentPage === 1}>
                    Précédent
                </button>
                <span>{currentPage}</span>
                <button onClick={goToNextPage}>Suivant</button>
            </div>
        </div>
    );
}
