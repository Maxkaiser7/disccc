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
            email : session?.user?.email
        }
    })
    const orgnisationsByUser = await prisma.organisation.findMany({
        where: {
            userId: user?.id
        }
    })
    //récupérer les organisations likées
    //trouver les orgas que l'utilisateur a like
    const likes = await prisma.likes.findMany({
        where: {
            User: {
                email: session?.user?.email
            },
            type: "organisation"
        }
    })
    const likedOrganisations = await prisma.organisation.findMany({
        where: {
            id:{
                in: likes.map(like => like.organisationId)
            }
        }
    })
    return(
        <main>
            {likedOrganisations.length > 0 && (
                    <>
                        <h2>Vos organisations likées</h2>
                        <div className={"flex gap-4 overflow-x-scroll"}>
                            {likedOrganisations.map(organisation => <OrganisationCard organisation={organisation} key={organisation.id} overflow={true}/>)}
                        </div>
                    </>
            )}
            <h1>Organisations</h1>
            {orgnisationsByUser.length ==0 && <Link href={"/organisations/new"}>S'inscrire comme organisation</Link>}
            {organisations.length == 0 && <p>Il n'y a aucune organisation</p>}
            {organisations.length > 0 && organisations.map((organisation: object ) => <OrganisationCard organisation={organisation}/>)}
        </main>
    )
}