"use client"
import React, {FormEvent, useEffect, useState} from "react";
import axios from "axios";
import {useRouter} from "next/router";

export default function EventForm() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [price, setPrice] = useState(0);
    const [address, setAddress] = useState("");
    const [facebookLink, setFacebookLink] = useState("");
    const [image, setImage] = useState("");
    const [rue, setRue] = useState("");
    const [cp, setCp] = useState("");
    const [commune, setCommune] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [resultArtists, setResultArtists] = useState([]);
    const [searchArtist, setSearchArtist] = useState("");
    const [query, setQuery] = useState("");
    const [artistSuggestions, setArtistSuggestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("name", name);
        formData.append("description", description);
        formData.append("dateFrom", dateFrom);
        formData.append("dateTo", dateTo);
        formData.append("price", price);
        formData.append("rue", rue);
        formData.append("commune", commune);
        formData.append("cp", cp);
        formData.append("facebookLink", facebookLink);
        formData.append("image", image);

// envoyez la demande à l'API en utilisant FormData
        try {
            const response = await axios.post("/api/event/addEvent", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
        } catch (error) {
            console.error(error);
            // Handle error here
        } finally {
            setIsLoading(false)
        }

    };
    const searchArtists = async (query) => {
        try {
            const response = await axios.get(`/api/artists/searchArtists?artistName=${query}`);
            setArtistSuggestions(response.data);
        } catch (error) {
            console.error(error);
        }
    };

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

    //ouverture ul artiste
    const handleItemClick = (artistName) => {
        setQuery(artistName);
        setIsOpen(false);
    };

    const handleInputClick = () => {
        setIsOpen(true);
    };
    return (
        <form onSubmit={handleSubmit}
              className={"flex flex-col gap-2"}
              encType={"multipart/form-data"}>
            <label htmlFor="name">Nom de l'événement</label>
            <input name={"name"} value={name} onChange={(e) => setName(e.target.value)}/>
            <label htmlFor="description">Description</label>
            <input
                name={"description"}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <div>
                <input
                    type="text"
                    name="artist"
                    value={query}
                    onChange={(event) => {
                        const value = event.target.value;
                        setQuery(value);
                        searchArtists(value);
                    }}
                    onClick={handleInputClick}
                />
                {isOpen && Array.isArray(artistSuggestions) && artistSuggestions.length > 0 && (
                    <ul>
                        {artistSuggestions.map((artist) => (
                            <li key={artist.id} onClick={() => handleItemClick(artist.artistName)}>
                                {artist.artistName}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <label htmlFor="dateFrom">Date de début</label>
            <input
                name={"dateFrom"}
                type={"date"}
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
            />
            <label htmlFor="dateTo">Date de fin</label>
            <input
                name={"dateTo"}
                type={"date"}
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
            />
            <label htmlFor="price">Prix</label>
            <input
                name={"price"}
                type={"number"}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
            />
            <div id={"adresse"} className={"grid"}>
                <label htmlFor="rue">Rue</label>
                <input
                    name={"rue"}
                    type={"string"}
                    value={rue}
                    onChange={(e) => setRue(e.target.value)}
                />
                <div className={"flex gap-4"}>
                <span>
                    <label htmlFor="commune">Commune</label>
                <input
                    name={"commune"}
                    type={"string"}
                    value={commune}
                    onChange={(e) => setCommune(e.target.value)}
                />
                </span>
                <span>
                                            <label htmlFor="cp">Code postal</label>
                <input
                    name={"cp"}
                    type={"string"}
                    value={cp}
                    onChange={(e) => setCp(e.target.value)}
                />
                </span>
                </div>
            </div>
            <label htmlFor="facebookLink">Evenement Facebook</label>
            <input type="string"
                   name={"facebookLink"}
                   value={facebookLink}
                   onChange={(e) => setFacebookLink(e.target.value)}/>
            <label htmlFor="image">Ajoutez une photo pour l'évenement</label>
            <input
                type="file"
                name={"image"}
                onChange={({target}) => {
                    if (target.files) {
                        const file: File = target.files[0];
                        setImage(URL.createObjectURL(file));
                        setImage(file);
                    }
                }}
            />
            <input type="submit"/>
        </form>
    );
}
