"use client"
import React, {FormEvent, useEffect, useState} from "react";
import axios from "axios";
import {useRouter} from "next/navigation";
import SubmitButton from "@/app/components/SubmitButton";
import postalcodes from "@/public/utils/zipcode-belgium.json";

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
    const [formGenre, setFormGenre] = useState([]);
    const [genre, setGenre] = useState("");
    const [organisation, setOrganisation] = useState<string>("");
    const [organisationSuggestion, setOrganisationSuggestion] = useState([]);
    const [isDisabled, setIsDisabled] = useState(false);
    const [imageSrc, setImageSrc] = useState();
    const [uploadData, setUploadData] = useState();
    const [filteredCities, setFilteredCities] = useState<string[]>([]);
    const [isCityOpen, setCityOpen] = useState(false);
    const [selectedArtist, setSelectedArtist] = useState('');
    const router = useRouter();
    // @ts-ignore
    //const errorDigest = error.digest;
    const handleOnChange = (changeEvent: any) => {
        const file = changeEvent.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (onLoadEvent: any) => {
                setImageSrc(onLoadEvent?.target?.result);
                setUploadData(undefined);
            };
            reader.readAsDataURL(file);
        }
    };
    useEffect(() => {
        console.log(imageSrc); // Check the updated imageSrc value
    }, [imageSrc]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        // envoyez la demande à l'API en utilisant FormData
        try {
            const form = e.currentTarget
            const fileInput : any = Array.from(form.elements).find((element: any) => element.name === "file")

            const imgFormData = new FormData();
            for (const file of fileInput.files) {
                imgFormData.append("file", file);
            }
            imgFormData.append("upload_preset", "imgUpload")
            const data = await fetch("https://api.cloudinary.com/v1_1/dsn7y9mu4/image/upload", {
                method: "POST",
                body: imgFormData,
            }).then(r => r.json());

            setImageSrc(data.url)
            console.log(imageSrc)
            setUploadData(data)
            const response = await axios.post("/api/event/newAddEvent", {
                method: "POST",
                params: {
                    name,
                    description,
                    dateFrom,
                    dateTo,
                    price,
                    rue,
                    commune,
                    cp,
                    facebookLink,
                    imageSrc : data.url,
                    artist: query,
                    genre,
                    organisation
                },
                headers: {
                    "Content-Type": "multipart/form-data"
                },

            });
            //setIsDisabled(true)
            const {id} = response.data;
            router.push(`/events/${id}`);

        } catch (error) {
            console.error(error);
            // Handle error here
        } finally {
            setIsDisabled(true)
            setIsLoading(false)
        }

    };
    const searchArtists = async (query: string) => {
        try {
            const response = await axios.get(`/api/artists/searchArtists?artistName=${selectedArtist}`);
            setArtistSuggestions(response.data);
        } catch (error) {
            console.error(error);
        }
    };
    const searchOrganisations = async (organisation: string) => {
        try {
            const response = await axios.get(`/api/organisations/searchOrganisations?organisationName=${organisation}`);
            setOrganisationSuggestion(response.data);
        } catch (error) {
            console.error(error);
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
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axios.get("/api/genres/getGenres");
                setFormGenre(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchGenres();
    }, []);
    //ouverture ul artiste
    const handleItemClick = (artistName: string) => {
        if (query === "") {
            setQuery(artistName);
        } else {
            setQuery(prevState => prevState + ", " + artistName);
        }
        setIsOpen(false);
    };
    const handleItemClickOrganisation = (organisationName: string) => {
        setOrganisation(organisationName);
        setIsOpen(false);
    }
    const handleInputClick = () => {
        setIsOpen(true);
    };
    //auto remplissage communes
    const handlePostalCodeChange = (event: any) => {
        const postalCode = event.target.value;
        const selectedPostalCodes = postalcodes.filter((item) => item.zip === postalCode);
        if (selectedPostalCodes.length > 0) {
            setFilteredCities((prevState) => {
                const citiesToAdd = selectedPostalCodes.map((item) => item.city);
                if (prevState) {
                    return [...prevState, ...citiesToAdd];
                } else {
                    return citiesToAdd;
                }
            });
            setCityOpen(selectedPostalCodes.length > 1); // Met à jour l'état isCityOpen en fonction du nombre de villes filtrées
        } else {
            setCityOpen(false); // Aucune ville filtrée, désactive la liste déroulante
        }
    };
    const handleChange = (event : any) => {
        const value = event.target.value;
        setQuery(value);
        setSelectedArtist('');
        searchArtists(value);
    };
    return (
        <form onSubmit={handleSubmit}
              className={"flex flex-col gap-2 m-auto w-9/12 lg:max-w-[50vw] text-black"}
              >
            <label htmlFor="name" className={"text-white"}>Nom de l'événement</label>
            <input name={"name"} className={"bg-slate-600 text-white"} value={name} onChange={(e) => setName(e.target.value)}/>
            <label htmlFor="description" className={"text-white"}>Description</label>
            <input
                name={"description"}
                className={"bg-slate-600 text-white"}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <label htmlFor="artist" className={"flex flex-col text-white"}>Artistes</label>
            <input
                className={"bg-slate-600 text-white"}
                type="text"
                name="artist"
                value={query || selectedArtist}
                onChange={handleChange}
                onClick={handleInputClick}
            />

            {isOpen && Array.isArray(artistSuggestions) && artistSuggestions.length > 0 && (
                <ul className={"text-white"}>
                    {artistSuggestions.map((artist: any) => (
                        <li key={artist.id} onClick={() => handleItemClick(artist.artistName)}
                            className={"bg-slate-800 hover:bg-slate-500 p-2"}>
                            {artist.artistName}
                        </li>
                    ))}
                </ul>
            )}

            <label htmlFor="organisation" className={"text-white"}>Organisation</label>
            <input type="text"
                   className={"bg-slate-600 text-white"}
                   name={"organisation"}
                   value={organisation}
                   onChange={(event) => {
                       const valueOrga: string = event.target.value;
                       setOrganisation(valueOrga);
                       searchOrganisations(valueOrga)
                   }}/>
            {isOpen && Array.isArray(organisationSuggestion) && organisationSuggestion.length > 0 && (
                <ul>
                    {organisationSuggestion.map((organisation: any) => (
                        <li key={organisation.id}
                            onClick={() => handleItemClickOrganisation(organisation.organisationName)}>
                            {organisation.organisationName}
                        </li>
                    ))}
                </ul>
            )}
            <label htmlFor="dateFrom" className={"text-white"}>Date de début</label>
            <input
                className={"bg-slate-600 text-white"}
                name={"dateFrom"}
                type={"date"}
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
            />
            <label htmlFor="dateTo" className={"text-white"}>Date de fin</label>
            <input
                name={"dateTo"}
                type={"date"}
                className={"bg-slate-600 text-white"}
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
            />
            <label htmlFor={"genre"} className={"text-white"}>Genre</label>
            <select
                name="genre"
                onChange={(event) => {
                    setGenre(event.target.value)
                }}
                className={"px-4 py-2 bg-slate-600 text-white"}
            >
                <option value="">Choisissez un genre</option>
                {formGenre.map((genre: any) => (
                    <option key={genre.id} value={genre.id}>
                        {genre.nom}
                    </option>
                ))}
            </select>
            <label htmlFor="price" className={"text-white"}>Prix</label>
            <input
                name={"price"}
                type={"number"}
                value={price}
                className={"bg-slate-600 text-white"}
                onChange={(e) => setPrice(Number(e.target.value))}
            />
            <div id={"adresse"} className={"grid gap-2"}>
                <label htmlFor="rue" className={"text-white"}>Rue</label>
                <input
                    name={"rue"}
                    type={"string"}
                    value={rue}
                    className={"bg-slate-600 text-white"}
                    onChange={(e) => setRue(e.target.value)}
                />
                <div className={"flex gap-4"}>
                                        <span className={"grid"}>
                                            <label htmlFor="cp" className={"text-white"}>Code postal</label>
                <input
                    name={"cp"}
                    type={"string"}
                    className={"bg-slate-600 text-white"}
                    value={cp}
                    onChange={(e) => {
                        setCp(e.target.value)
                        handlePostalCodeChange(e)
                    }}
                />
                </span>
                    <span className="grid relative">
                    <label htmlFor="commune" className="text-white">Commune</label>
                        <input
                          name="commune"
                          type="text"
                          className={"bg-slate-600 text-white"}
                          value={commune}
                          onChange={(e) => setCommune(e.target.value)}
                      />
                        {isCityOpen && (
                            <ul className="text-white absolute top-full left-0 mt-1">
                                {filteredCities.map((city: string, index: number) => (
                                    <li
                                        key={index}
                                        onClick={() => {
                                            setCommune(city);
                                            setCityOpen(false);
                                        }}
                                        className="bg-slate-800 hover:bg-slate-500 p-2"
                                    >
                                        {city}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </span>

                </div>
            </div>
            <label htmlFor="facebookLink" className={"text-white"}>Evenement Facebook</label>
            <input type="string"
                   name={"facebookLink"}
                   value={facebookLink}
                   className={"bg-slate-600 text-white"}
                   onChange={(e) => setFacebookLink(e.target.value)}/>
            <label htmlFor="image" className={"text-white"}>Ajoutez une photo pour l'évenement</label>
            <p>
                <input type="file" name={"file"} className={"text-white"} onChange={handleOnChange}/>
            </p>
            <button type={"submit"}
                    disabled={isDisabled}
                    className={"bg-gray-800 px-4 py-2 disabled:opacity-20"}>Confirmer</button>
        </form>
    );
}