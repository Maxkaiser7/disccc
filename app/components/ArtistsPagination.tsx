"use client"
import { useEffect, useState } from "react";
import axios from "axios";
import ArtistCard from "@/app/components/Cards/ArtistCard";

export default function ArtistsPagination() {
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
                });
                setArtists(response.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchArtists();
    }, [currentPage, itemsPerPage]);


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
            <div className="md:flex md:flex-wrap md:justify-center md:gap-4">
                {artists.length === 0 ? (
                    <p>Aucun artiste à afficher pour le moment.</p>
                ) : (
                    artists.map((artist) => (
                        <ArtistCard overflow={false} artist={artist} key={artist.id} />
                    ))
                )}
            </div>
            <div className={"flex justify-center gap-2"}>
                <button onClick={goToPreviousPage} disabled={currentPage === 1}>
                    Précédent
                </button>
                <span>{currentPage}</span>
                <button onClick={goToNextPage}>Suivant</button>
            </div>
        </div>
    );
}
