import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import Link from "next/link";
import prisma from "@/prisma/client";
import UpdateOrganisationForm from "@/app/organisations/[organisationName]/update/UpdateOrganisationForm";
export default async function UpdateProfilePage (){
    const session = await getServerSession( authOptions)
    const organisation = await prisma.organisation.findFirst({
        where: {
            userId: session?.user?.id
        },
    })

    return(
        <div>
            <UpdateOrganisationForm organisationName={organisation?.organisationName}/>
            <Link href={`/profil/${session?.user?.name}`}>Retour au profil</Link>
        </div>
    )
}