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
import SubmitButton from "@/app/components/SubmitButton";
type UpdateUserFormProps = {
    name: string | null | undefined
}
export default function UpdateUserForm({ name }: UpdateUserFormProps) {
    {
        const [isLoading, setIsLoading] = useState(true);
        const [name, setName] = useState("");
        const [isDisabled, setIsDisabled] = useState(false);
        const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            const formData = new FormData();
            formData.append("name",name)
            // envoyez la demande à l'API en utilisant FormData
            try {
                const response = await axios.post("/api/account/updateAccount", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });
                setIsDisabled(true)
            } catch (error) {
                console.error(error);
                // Handle error here
            } finally {
                setIsLoading(false)
            }

        };


        return (
            <div>
                <form onSubmit={handleSubmit} className={"grid justify-center gap-4"}>
                    <label htmlFor="name">Changez votre nom</label>
                    <input type={"text"} name={"name"} value={name}  onChange={(e) => setName(e.target.value)}/>
                    <SubmitButton isDisabled={isDisabled} inputValue={"Mettre à jour"}/>
                </form>
            </div>
        )
    }
}