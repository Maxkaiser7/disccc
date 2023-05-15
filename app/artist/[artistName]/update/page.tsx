import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import UpdateUserForm from "@/app/profil/[username]/update/UpdateUserForm";
import Link from "next/link";
import UpdateArtistForm from "@/app/artist/[artistName]/update/UpdateArtistForm";
import prisma from "@/prisma/client";

export default async function UpdateProfilePage (){
    const session = await getServerSession( authOptions)
    const artist = await prisma.artist.findFirst({
        where: {
            userId: session?.user?.id
        },
    })
    return(
        <div>
            <UpdateArtistForm artistName={artist?.artistName}/>
            <Link href={`/profil/${session?.user?.name}`}>Retour au profil</Link>
        </div>
    )
}