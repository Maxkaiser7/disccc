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
                    className={"flex flex-col gap-2 m-auto w-9/12 lg:max-w-[50vw] text-black"}
                >
                    <div className={"flex flex-col"}>
                        <label htmlFor={"pseudo"} className={"text-white"}>Votre nom d'artiste</label>
                        <input
                            type="text"
                            placeholder={"pseudo"}
                            name={"artistName"}
                            className={"bg-slate-600 text-white"}
                            onChange={(e) => setArtistName(e.target.value)}
                            value={artistName}
                        />
                    </div>
                    <div className={"flex flex-col"}>
                        <label htmlFor={"description"} className={"text-white"}>Description</label>
                        <textarea
                            name={"description"}
                            className={"bg-slate-600 text-white p-2"}
                            placeholder={"Décrivez-vous..."}
                            onChange={(event) => setDescription(event.target.value)}
                        />
                    </div>
                    <div className={"flex flex-col"}>
                        <label htmlFor="spotifyLink" className={"text-white"}>Lien spotify</label>
                        <input
                            type="text"
                            placeholder={"spotify"}
                            name={"spotifyLink"}
                            className={"bg-slate-600 text-white"}
                            onChange={(e) => setSpotifyLink(e.target.value)}
                            value={spotifyLink}
                        />
                    </div>
                    <div className={"flex flex-col"}>
                        <label htmlFor="instagramLink" className={"text-white"}>Lien instagram</label>
                        <input
                            type="text"
                            placeholder={"instagram"}
                            name={"instagramLink"}
                            className={"bg-slate-600 text-white"}
                            onChange={(e) => setInstagramLink(e.target.value)}
                            value={instagramLink}
                        />
                    </div>
                    <div className={"flex flex-col"}>
                        <label htmlFor="soundcloudLink" className={"text-white"}>Lien soundcloud</label>
                        <input
                            type="text"
                            placeholder={"soundcloud"}
                            name={"soundcloudLink"}
                            className={"bg-slate-600 text-white"}
                            onChange={(e) => setSoundcloudLink(e.target.value)}
                            value={soundcloudLink}
                        />
                    </div>
                    <div className={"flex flex-col"}>
                        <label htmlFor="twitterLink" className={"text-white"}>Lien twitter</label>
                        <input
                            type="text"
                            placeholder={"twitter"}
                            name={"twitterLink"}
                            className={"bg-slate-600 text-white"}
                            onChange={(e) => setTwitterLink(e.target.value)}
                            value={twitterLink}
                        />
                    </div>
                    <div className={"flex flex-col"}>
                        <label htmlFor="appleLink" className={"text-white"}>Lien apple</label>
                        <input
                            type="text"
                            placeholder={"apple"}
                            name={"appleLink"}
                            className={"bg-slate-600 text-white"}
                            onChange={(e) => setAppleLink(e.target.value)}
                            value={appleLink}
                        />
                    </div>
                    <div className={"flex flex-col"}>
                        <label htmlFor="tiktokLink" className={"text-white"}>Lien tiktok</label>
                        <input
                            type="text"
                            placeholder={"tiktok"}
                            name={"tiktokLink"}
                            className={"bg-slate-600 text-white"}
                            onChange={(e) => setTiktokLink(e.target.value)}
                            value={tiktokLink}
                        />
                    </div>
                    <p>
                        <input type="file" name={"file"}/>
                    </p>
                        <label htmlFor={"genre"} className={"text-white"}>Genre</label>
                        <select
                            name="genre"
                            onChange={(event) => setGenre(event.target.value)}
                            className={"px-4 py-2 bg-slate-600 text-white"}
                        >
                            <option value="">Choisissez un genre</option>
                            {formGenre?.map((genre : any) => (
                                <option key={genre.id} value={genre.id}>
                                    {genre.nom}
                                </option>
                            ))}
                        </select>
                    <SubmitButton isDisabled={isDisabled} inputValue={"Créer"}/>
                </form>
            )}
        </div>
    );
}