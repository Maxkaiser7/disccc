"use client"
import {useEffect, useState} from 'react';
import SubmitButton from "@/app/components/SubmitButton";
import axios from 'axios';
import {BsFillTrashFill} from "react-icons/bs";
import prisma from "@/prisma/client";
import getArtists from "@/app/artists/page";

interface Artist {
    id: number;
    name: string;
}
interface Event {
    id: number;
    name: string;
    description: string;
    image: string;
    userId: number;
    createdAt: string;
    dateFrom: string;
    dateTo: string;
    price: number;
    facebookLink: string;
    address: string;
    Comments: string;
    ArtistsOnEvents: string;
    genres: string;
    genresId: number;
    unsignedOrganisation: string;
    artist: string;
    artistId: number;
    organisation: string;
    organisationId: number;
}
export default function AdminGenre() {
    const [genres, setGenres] = useState([]);
    const [query, setQuery] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);
    const [error, setError] = useState("");
    // @ts-ignore
    const [relatedArtists, setRelatedArtists] = useState<Artist>([]);
    const [relatedEvents, setRelatedEvents] = useState([]);
  useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axios.get('/api/genres/getGenres');
                setGenres(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchGenres();
    }, [genres]);

    const deleteGenre = async (genreId: string) => {

        try {
            // Vérifier si des artistes ont ce genre
            const res = await axios.post(`/api/artists/getArtistsByGenre/`, { genreId });
            const relatedArtists = res.data.artists;
            const relatedEvents = res.data.events;
            // Utiliser une fonction de rappel pour mettre à jour les compteurs après la mise à jour des tableaux


            console.log(relatedArtists);
            console.log(relatedEvents);

            let confirmed = false;

            if (relatedArtists.length > 0 || relatedEvents.length > 0) {
                const message = `Il y a ${relatedArtists.length} artistes et ${relatedEvents.length} événements avec ce genre`;
                const shouldConfirm = window.confirm(message);

                if (!shouldConfirm) {
                    // Annuler dès la première confirmation
                    return;
                }
            }

            confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer ce genre ?");

            if(confirmed){
                await axios.post(`/api/genres/deleteGenres/`, {
                    params: {genreId},
                });
                setGenres((prevGenres) => prevGenres.filter((genre : any) => genre.id !== genreId));

            }
        } catch (error) {
            console.log(error);
        }
    };
    const handleSubmit = async (e : any) => {
        e.preventDefault();
        // Vérifier si le genre existe déjà
        const genreExists = genres.some((genre : any) => genre.nom.toLowerCase() === query.toLowerCase());
        if (genreExists) {
            window.alert("Ce genre existe déjà.");
            setError("Ce genre existe déjà.");
            return;
        }

        try {
            await axios.post(`/api/genres/addGenre`, {
                params: { query },
            });
            setQuery("");
            setError("");
        } catch (error) {
            console.log(error);
        }
    }
    const inputValue: string = "Ajouter";

    return (
        <div className="overflow-x-auto grid justify-center">
            <form onSubmit={handleSubmit} className={"grid justify-center"}>
                <label htmlFor="query" className={"text-center"}>Ajouter un genre</label>
                <input type="text"
                       onChange={(e) => {
                           const value = e.target.value;
                           setQuery(value)
                       }}
                       value={query}
                       name={query}/>
                <SubmitButton
                    isDisabled={query === ''}
                    inputValue={inputValue}/>
            </form>
            <table className="table-auto border-collapse border-white border">
                <thead>
                <tr className={"bg-slate-700 "}>
                    <th className="px-4 py-2">Actions</th>
                    <th className="px-4 py-2">Name</th>
                </tr>
                </thead>
                <tbody>
                {genres.map((genre : any) => (
                    <tr key={genre.id}>
                        <td className="border px-4 py-2 whitespace-nowrap">
                            <button
                                onClick={() => deleteGenre(genre.id)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <BsFillTrashFill/>
                            </button>
                        </td>
                        <td className="border px-4 py-2">{genre.nom}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
