'use client'
import React, {useState, useEffect, FormEvent} from "react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import FormData from "form-data";
import {getSession, signIn} from "next-auth/react";
import {useSession} from "next-auth/react"
import {useRouter} from "next/navigation";

import Link from "next/link";
import SubmitButton from "@/app/components/SubmitButton";
interface Genre {
    id: string;
    nom: string;
}
export default function SignInArtist() {
    const [artistName, setArtistName] = useState("");
    const [selectedFile, setSelectedFile] = useState<File>();
    const [isDisabled, setIsDisabled] = useState(false);
    const [isRegistered, setIsRegistered] = useState();
    const [isConnected, setIsConnected] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [genre, setGenre] = useState("");
    const [formGenre, setFormGenre] = useState([]);
    const [description, setDescription] = useState("");
    const [instagramLink, setInstagramLink] = useState<string>("");
    const [spotifyLink, setSpotifyLink] = useState<string>("");
    const [soundcloudLink, setSoundcloudLink] = useState<string>("");
    const [twitterLink, setTwitterLink] = useState<string>("");
    const [appleLink, setAppleLink] = useState<string>("");
    const [tiktokLink, setTiktokLink] = useState<string>("");
    const [imageSrc, setImageSrc] = useState("");
    const [uploadData, setUploadData] = useState({});
    const handleFileChange = (event : any) => {
        const files = event.target.files;
        setSelectedFile(files ? files : null);
    };
    const router = useRouter();

    //vérifier si l'utilisateur à déjà un compte artiste
    useEffect(() => {
        const checkArtistRegistration = async () => {
            const session = await getSession()
            if (!session) {
                setIsConnected(false)
            }
            try {
                const {data} = await axios.get("/api/signin/artistRegistered");
                setIsRegistered(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        checkArtistRegistration();
    }, []);
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axios.get("/api/genres/getGenres");
                setFormGenre(response.data);
                console.log(formGenre)
            } catch (error) {
                console.error(error);
            }
        };

        fetchGenres();
    }, []);

    const submitPost = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget
        const fileInput : any = Array.from(form.elements).find((element: any) => element.name === "file")

        const imgFormData = new FormData();
        for (const file of fileInput.files){
            imgFormData.append("file", file);
        }
        imgFormData.append("upload_preset", "imgUpload")
        const data = await fetch("https://api.cloudinary.com/v1_1/dsn7y9mu4/image/upload", {
            method: "POST",
            // @ts-ignore
            body: imgFormData,
        }).then(r => r.json());

        setImageSrc(data.url)
        setUploadData(data)
        try {
            //if (!selectedFile) return
            //const formData = new FormData()

            const response = await axios.post("/api/signin/addArtist", {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                method: "POST",
                params: {artistName, description, genre, instagramLink, spotifyLink, soundcloudLink, twitterLink, appleLink, tiktokLink, imageSrc: data.url},
            });
            setIsDisabled(true)
            const {artistname} = response.data
            router.push(`/artist/${artistname}`);
            //console.log(data)
        } catch (err) {
            // @ts-ignore
            console.log(err.response?.data)
        }
    };
    // @ts-ignore
    return (
        <div>
            {isLoading ? (
                <p>Chargement en cours...</p>
            ) : isRegistered ? (
                <h2 className={"flex justify-center text-2xl"}>Vous êtes déjà enregistré en tant qu'artiste</h2>
            ) : !isConnected ? (

                <div>
                    <p>Veuillez vous connecter</p>
                    <button className={"text-sm bg-gray-700 text-white py-2 px-6 disabled:opacity-25"}
                            onClick={() => signIn()}>
                        Sign in
                    </button>
                </div>
            ) : (
                <form
                    onSubmit={submitPost}
                    encType={"multipart/form-data"}
                    className={"flex flex-col  items-center gap-2"}
                >
                    <div className={"flex flex-col"}>
                        <label htmlFor={"pseudo"}>Votre nom d'artiste</label>
                        <input
                            type="text"
                            placeholder={"pseudo"}
                            name={"artistName"}
                            className={"w-[70vw] py-2 px-4 text-black border-gray-950"}
                            onChange={(e) => setArtistName(e.target.value)}
                            value={artistName}
                        />
                    </div>
                    <div className={"flex flex-col"}>
                        <label htmlFor={"description"}>Description</label>
                        <textarea
                            name={"description"}
                            className={"w-[70vw] py-2 px-4 text-black border-gray-950"}
                            placeholder={"Décrivez-vous..."}
                            onChange={(event) => setDescription(event.target.value)}
                        />
                    </div>
                    <div className={"flex flex-col"}>
                        <label htmlFor="spotifyLink">Lien spotify</label>
                        <input
                            type="text"
                            placeholder={"spotify"}
                            name={"spotifyLink"}
                            className={"w-[70vw] py-2 px-4 text-black border-gray-950"}
                            onChange={(e) => setSpotifyLink(e.target.value)}
                            value={spotifyLink}
                        />
                    </div>
                    <div className={"flex flex-col"}>
                        <label htmlFor="instagramLink">Lien instagram</label>
                        <input
                            type="text"
                            placeholder={"instagram"}
                            name={"instagramLink"}
                            className={"w-[70vw] py-2 px-4 text-black border-gray-950"}
                            onChange={(e) => setInstagramLink(e.target.value)}
                            value={instagramLink}
                        />
                    </div>
                    <div className={"flex flex-col"}>
                        <label htmlFor="soundcloudLink">Lien soundcloud</label>
                        <input
                            type="text"
                            placeholder={"soundcloud"}
                            name={"soundcloudLink"}
                            className={"w-[70vw] py-2 px-4 text-black border-gray-950"}
                            onChange={(e) => setSoundcloudLink(e.target.value)}
                            value={soundcloudLink}
                        />
                    </div>
                    <div className={"flex flex-col"}>
                        <label htmlFor="twitterLink">Lien twitter</label>
                        <input
                            type="text"
                            placeholder={"twitter"}
                            name={"twitterLink"}
                            className={"w-[70vw] py-2 px-4 text-black border-gray-950"}
                            onChange={(e) => setTwitterLink(e.target.value)}
                            value={twitterLink}
                        />
                    </div>
                    <div className={"flex flex-col"}>
                        <label htmlFor="appleLink">Lien apple</label>
                        <input
                            type="text"
                            placeholder={"apple"}
                            name={"appleLink"}
                            className={"w-[70vw] py-2 px-4 text-black border-gray-950"}
                            onChange={(e) => setAppleLink(e.target.value)}
                            value={appleLink}
                        />
                    </div>
                    <div className={"flex flex-col"}>
                        <label htmlFor="tiktokLink">Lien tiktok</label>
                        <input
                            type="text"
                            placeholder={"tiktok"}
                            name={"tiktokLink"}
                            className={"w-[70vw] py-2 px-4 text-black border-gray-950"}
                            onChange={(e) => setTiktokLink(e.target.value)}
                            value={tiktokLink}
                        />
                    </div>
                    <p>
                        <input type="file" name={"file"}/>
                    </p>
                    <div className={"flex flex-col w-[70vw]"}>
                        <label htmlFor={"genre"}>Genre</label>
                        <select
                            name="genre"
                            onChange={(event) => setGenre(event.target.value)}
                            className={"px-4 py-2"}
                        >
                            <option value="">Choisissez un genre</option>
                            {formGenre?.map((genre : any) => (
                                <option key={genre.id} value={genre.id}>
                                    {genre.nom}
                                </option>
                            ))}
                        </select>
                    </div>
                    <SubmitButton isDisabled={isDisabled} inputValue={"Créer"}/>
                </form>
            )}
        </div>
    );
}