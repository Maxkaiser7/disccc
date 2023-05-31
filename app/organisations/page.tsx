import Link from "next/link";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import { PrismaClient } from '@prisma/client'
import EventCard from "@/app/components/Cards/EventCard";
import OrganisationCard from "@/app/components/Cards/OrganisationCard";
const prisma = new PrismaClient()

export default async function Organisations(){
    const organisations = await prisma.organisation.findMany()
    const session = await getServerSession(authOptions)
    //check si l'user est déjà inscrit en tant qu'orga
    const user = await prisma.user.findUnique({
        where: {
            email : session.user.email
        }
    })
    const orgnasationsByUser = await prisma.organisation.findMany({
        where: {
            userId: user?.id
        }
    })
    return(
        <main>
            <h1>Organisations</h1>
            {orgnasationsByUser.length ==0 && <Link href={"/organisations/new"}>S'inscrire comme organisation</Link>}
            {organisations.length == 0 && <p>Il n'y a aucune organisation</p>}
            {organisations.length > 0 && organisations.map((organisation: object ) => <OrganisationCard organisation={organisation}/>)}
        </main>
    )
}