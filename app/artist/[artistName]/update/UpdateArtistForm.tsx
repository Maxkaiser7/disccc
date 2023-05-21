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
    artistName: string | null | undefined
}
export default function UpdateArtistForm({artistName: propArtistName}: UpdateArtistFormProps) {
    {
        const [isDisabled, setIsDisabled] = useState(false);
        const [isLoading, setIsLoading] = useState(true);
        const [artistName, setArtistName] = useState(propArtistName ?? "");
        const [selectedFile, setSelectedFile] = useState<File>();
        useEffect(() => {
            setIsLoading(false); // Mettez setLoading(true) si vous souhaitez initialement afficher "Chargement en cours"
        }, []);

        const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            const formData = new FormData();
            formData.append("image", selectedFile)
            formData.append("artistName", artistName)
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
                <form onSubmit={handleSubmit} className={"flex flex-col"}
                      encType={"multipart/form-data"}>
                    <label htmlFor="artistName">Changez votre nom</label>
                    <input
                        type="text"
                        placeholder={"pseudo"}
                        name={"artistName"}
                        className={"w-9/12 py-2 px-4 border-gray-950"}
                        onChange={(e) => setArtistName(e.target.value)}
                        value={artistName}
                    />
                    <input
                        type="file"
                        name={"image"}
                        onChange={({target}) => {
                            if (target.files) {
                                const file: File = target.files[0];
                                console.log(file)
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