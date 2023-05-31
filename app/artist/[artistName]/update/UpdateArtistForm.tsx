"use client"
import prisma from "@/prisma/client";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {getSession, useSession} from "next-auth/react";
import axios from "axios";
import React, {FormEvent, useState, useEffect} from "react";
import {useRouter} from "next/router";
import Link from "next/link";
import {session} from "next-auth/core/routes";

type UpdateArtistFormProps = {
    artist: object
}
export default function UpdateArtistForm({artist: propArtist}: UpdateArtistFormProps) {
    {
        const [isDisabled, setIsDisabled] = useState(false);
        const [isLoading, setIsLoading] = useState(true);
        const [artistName, setArtistName] = useState(propArtist.artistName ?? "");
        const [selectedFile, setSelectedFile] = useState<File>();
        const [instagramLink, setInstagramLink] = useState<string>(propArtist.instagramLink ?? "");
        const [spotifyLink, setSpotifyLink] = useState<string>(propArtist.spotifyLink ?? "");
        const [soundcloudLink, setSoundcloudLink] = useState<string>(propArtist.soundcloudLink ?? "");
        const [twitterLink, setTwitterLink] = useState<string>(propArtist.twitterLink ?? "");
        const [appleLink, setAppleLink] = useState<string>(propArtist.appleLink ?? "");
        const [tiktokLink, setTiktokLink] = useState<string>(propArtist.tiktokLink ?? "");
        useEffect(() => {
            setIsLoading(false); // Mettez setLoading(true) si vous souhaitez initialement afficher "Chargement en cours"
        }, []);

        const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            const formData = new FormData();
            formData.append("image", selectedFile)
            formData.append("artistName", artistName)
            formData.append("spotifyLink", spotifyLink)
            formData.append("soundcloudLink", soundcloudLink)
            formData.append("instagramLink", instagramLink)
            formData.append("twitterLink", twitterLink)
            formData.append("appleLink", appleLink)
            formData.append("tiktokLink", tiktokLink)

            // envoyez la demande à l'API en utilisant FormData
            try {
                const response = await axios.post("/api/artists/editArtist", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                });
                setIsDisabled(true)
            } catch (error) {
                console.error(error);
                // Handle error here
            }

        };

        return (
            <div>
                {isLoading ? (
                    <p>Chargement en cours</p>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        encType={"multipart/form-data"}
                        className={"flex flex-col  items-center gap-2"}
                    >
                        <div className={"flex flex-col"}>
                            <label htmlFor={"pseudo"}>Votre nom d'artiste</label>
                            <input
                                type="text"
                                placeholder={"pseudo"}
                                name={"artistName"}
                                className={"w-[70vw] py-2 px-4 border-gray-950"}
                                onChange={(e) => setArtistName(e.target.value)}
                                value={artistName}
                            />
                        </div>
                        <div className={"flex flex-col"}>
                            <label htmlFor={"description"}>Description</label>
                            <textarea
                                name={"description"}
                                className={"w-[70vw] py-2 px-4 border-gray-950"}
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
                                className={"w-[70vw] py-2 px-4 border-gray-950"}
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
                                className={"w-[70vw] py-2 px-4 border-gray-950"}
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
                                className={"w-[70vw] py-2 px-4 border-gray-950"}
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
                                className={"w-[70vw] py-2 px-4 border-gray-950"}
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
                                className={"w-[70vw] py-2 px-4 border-gray-950"}
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
                                className={"w-[70vw] py-2 px-4 border-gray-950"}
                                onChange={(e) => setTiktokLink(e.target.value)}
                                value={tiktokLink}
                            />
                        </div>
                        <input
                            type="file"
                            name={"image"}
                            onChange={({target}) => {
                                if (target.files) {
                                    const file: File = target.files[0];
                                    setSelectedFile(URL.createObjectURL(file));
                                    setSelectedFile(file);
                                }
                            }}
                        />
                        <button
                            type={"submit"}
                            disabled={isDisabled}
                            className={"bg-gray-800 px-4 py-2 disabled:opacity-20"}
                        >
                            Confirmer
                        </button>
                    </form>
                )}
            </div>
        )
    }
}