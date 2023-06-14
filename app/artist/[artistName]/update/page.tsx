import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import UpdateUserForm from "@/app/profil/[username]/update/UpdateUserForm";
import Link from "next/link";
import UpdateArtistForm from "@/app/artist/[artistName]/update/UpdateArtistForm";
import prisma from "@/prisma/client";

export default async function UpdateProfilePage (){
    const session = await getServerSession( authOptions)
    const user = await prisma.user.findUnique({
        where: {
            email: session?.user?.email
        }
    })
    const artist = await prisma.artist.findFirst({
        where: {
            userId: user?.id
        },
    })
    return(
        <div>
            <UpdateArtistForm artist={artist}/>
            <Link href={`/profil/${session?.user?.name}`} className={"p-8"}>Retour au profil</Link>
        </div>
    )
}