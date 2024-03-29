import Link from "next/link";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import { PrismaClient } from '@prisma/client'
import EventCard from "@/app/components/Cards/EventCard";
import OrganisationCard from "@/app/components/Cards/OrganisationCard";
import OrganisationsPagination from "@/app/components/OrganisationsPagination";
const prisma = new PrismaClient()
export const dynamic = 'force-static'
export default async function Organisations(){
    const organisations = await prisma.organisation.findMany()
    const session = await getServerSession(authOptions)
    //check si l'user est déjà inscrit en tant qu'orga
    let user: any = []
    let orgnisationsByUser: any = []
    let likes: any = []
    let likedOrganisations: any = []
    if (session){
        user = await prisma.user.findUnique({
            where: {
                // @ts-ignore
                email : session?.user?.email
            }
        })
        orgnisationsByUser = await prisma.organisation.findMany({
            where: {
                userId: user?.id
            }
        })
        likes = await prisma.likes.findMany({
            where: {
                userId: user?.id ,
                type: "organisation"
            }
        })
        console.log(likes)
        if (likes.length > 0){
            likedOrganisations = await prisma.organisation.findMany({
                where: {
                    id: {
                        in: likes.map((like: any) => like.organisationId)
                    }
                }
            })
        }
        console.log(likedOrganisations)

    }

    return(
        <main className={"px-8"}>
            {likedOrganisations.length === 1 && (
                <>
                    <h2 className={"mt-4 text-2xl"}>Vos organisations likées</h2>
                    <div className={"flex gap-4 overflow-x-scroll "}>
                        {likedOrganisations.map((organisation : any) =>
                            <OrganisationCard organisation={organisation} key={organisation.id} overflow={false}/>
                    )}
                    </div>
                </>
            )}
            {likedOrganisations.length > 1 && (
                    <>
                        <h2>Vos organisations likées</h2>
                        <div className={"flex gap-4 overflow-x-scroll justify-center"}>
                            {likedOrganisations.map((organisation: any) => <OrganisationCard organisation={organisation} key={organisation.id} overflow={true}/>)}
                        </div>
                    </>
            )}
            <h1 className={"mt-4 text-3xl text-center mb-8"}>Organisations</h1>
            <span className={"flex justify-center"}>
                {(orgnisationsByUser.length == 0 && session)  && <Link href={"/organisations/new"} className={"bg-gray-800 py-2 px-4 mb-8 hover:bg-gray-700"}>S'inscrire comme organisation</Link>}
            </span>
                <OrganisationsPagination/>
        </main>
    )
}