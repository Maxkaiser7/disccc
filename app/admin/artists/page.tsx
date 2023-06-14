"use client"
import prisma from "@/prisma/client";
import {useEffect, useState} from "react";
import axios from "axios";

export default function adminArtist() {
    const [artists, setArtists] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

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
    const deleteArtist = async (artistId : string) => {
        try {
            await axios.post(`/api/artists/deleteArtist/`,  {
                params: {artistId},
            })
            setArtists(prevArtists => prevArtists.filter(artist => artist.id !== artistId));

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
    return (
        <div className="overflow-x-auto">
            <table className="table-auto border-collapse border-white border">
                <thead>
                <tr>
                    <th className="px-4 py-2">id</th>
                    <th className="px-4 py-2">artistName</th>
                    <th className="px-4 py-2">createdAt</th>
                    <th className="px-4 py-2">description</th>
                    <th className="px-4 py-2">appleLink</th>
                    <th className="px-4 py-2">instagramLink</th>
                    <th className="px-4 py-2">soundcloudLink</th>
                    <th className="px-4 py-2">tiktokLink</th>
                    <th className="px-4 py-2">twitterLink</th>
                    <th className="px-4 py-2">spotifyLink</th>
                    <th className="px-4 py-2">isPromoted</th>
                    <th className="px-4 py-2">Actions</th> {/* Nouvelle colonne pour les actions */}
                </tr>
                </thead>
                <tbody>
                {artists.map((artist) => {
                    return (
                        <tr key={artist.id}>
                            <td className="border px-4 py-2">{artist.id}</td>
                            <td className="border px-4 py-2">{artist.artistName}</td>
                            <td className="border px-4 py-2">
                                {artist.createdAt ? artist.createdAt : "N/A"}
                            </td>
                            <td className="border px-4 py-2">{artist.description}</td>
                            <td className="border px-4 py-2">{artist.appleLink}</td>
                            <td className="border px-4 py-2">{artist.instagramLink}</td>
                            <td className="border px-4 py-2">{artist.soundcloudLink}</td>
                            <td className="border px-4 py-2">{artist.tiktokLink}</td>
                            <td className="border px-4 py-2">{artist.twitterLink}</td>
                            <td className="border px-4 py-2">{artist.spotifyLink}</td>
                            <td className="border px-4 py-2">{artist.isPromoted}</td>
                            <td className="border px-4 py-2">
                                <button
                                    onClick={() => deleteArtist(artist.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    &#10006; {/* Croix de suppression */}
                                </button>
                            </td>
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
