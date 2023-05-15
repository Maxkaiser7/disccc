"use client"
import prisma from "@/prisma/client";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {getSession, useSession} from "next-auth/react";
import axios from "axios";
import React, {FormEvent, useState} from "react";
import {useRouter} from "next/router";
import Link from "next/link";
import {session} from "next-auth/core/routes";

type UpdateArtistFormProps = {
    artistName: string | null | undefined
}
export default function UpdateArtistForm({artistName: propArtistName}: UpdateArtistFormProps) {
    {
        const [isLoading, setIsLoading] = useState(true);
        const [artistName, setArtistName] = useState(propArtistName ?? "");

        const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            const formData = new FormData();
            formData.append("artistName", artistName)
            // envoyez la demande à l'API en utilisant FormData
            try {
                const response = await axios.post("/api/artists/editArtist", formData, {
                    headers: {
                        "Content-Type": "application/json",

                    }
                });
            } catch (error) {
                console.error(error);
                // Handle error here
            } finally {
                setIsLoading(false)
            }

        };


        return (
            <div>
                <form onSubmit={handleSubmit} className={"flex flex-col"}>
                    <label htmlFor="artistName">Changez votre nom</label>
                    <input
                        type="text"
                        placeholder={"pseudo"}
                        name={"artistName"}
                        className={"w-9/12 py-2 px-4 border-gray-950"}
                        onChange={(e) => setArtistName(e.target.value)}
                        value={artistName}
                    /> <input type={"submit"}/>
                </form>
            </div>
        )
    }
}