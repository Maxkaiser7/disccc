"use client"
import { useEffect, useState } from 'react';
import SubmitButton from "@/app/components/SubmitButton";
import axios from 'axios';

export default function AdminGenre() {
    const [genres, setGenres] = useState([]);
    const [query, setQuery] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);
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
    const deleteGenre = async (genreId : string) => {
        try {
            await axios.post(`/api/genres/deleteGenres/`, {
                params: {genreId},
            });
            setGenres((prevGenres) => prevGenres.filter((genre) => genre.id !== genreId));
        } catch (error) {
            console.log(error);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`/api/genres/addGenre`, {
                params: {query},
            });
            setQuery("");
        }
        catch (error) {
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
                <tr>
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                {genres.map((genre) => (
                    <tr key={genre.id}>
                        <td className="border px-4 py-2">{genre.id}</td>
                        <td className="border px-4 py-2">{genre.nom}</td>
                        <td className="border px-4 py-2">
                            <button
                                onClick={() => deleteGenre(genre.id)}
                                className="text-red-500 hover:text-red-700"
                            >
                                &#10006;
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
