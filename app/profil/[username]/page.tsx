import UpdateUserForm from "@/app/profil/[username]/update/UpdateUserForm"
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import Link from "next/link";
import prisma from "@/prisma/client";
import Logged from "@/app/auth/Logged";
import Image from "next/image";
import axios from "axios";
import {log} from "util";

export default async function ProfilPage({params, searchParams,}: {
    params: { username: string };
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const session = await getServerSession(authOptions)
    const user = await prisma.user.findUnique({
        where: {
            email: session?.user?.email
        }
    })
    const artist = await prisma.artist.findFirst({
        where: {
            userId: session?.user?.id

        }
    })
    if (artist){
        const artistNameLower = artist.artistName.toLowerCase()
        const artistName = artistNameLower.replace(/\s+/g, "")
    }



    return (
        <div className={"flex flex-col content-center flex-wrap items-center"}>
            <h1 className={"text-3xl"}>Profil</h1>
            <Image width={64} height={64} className={"w-3/12 rounded-full"} src={session.user.image} alt={""}/>
            <h2>{session.user.name}</h2>
            <div className={"flex flex-col gap-4 mt-10"}>
                <span className={"bg-slate-800 p-2 flex justify-center border-gray-950 rounded"}>
                <Link href={`/profil/${params.username}/update`}>Modifier mon profil</Link>
                </span>
                {!artist && (
                    <span className={"bg-slate-800 p-2 flex flex-col items-center border-gray-950 rounded"}>
                        <Link href={`/signinartist`}>Créer mon profil artiste</Link>
                </span>)}
                {artist && (
                    <span className={"bg-slate-800 p-2 flex flex-col items-center border-gray-950 rounded"}>
                        <Link href={`/artist/${artistName}/update`}>Modifier mon profil artiste</Link>
                    </span>
                )}
            </div>
        </div>
    )
}

