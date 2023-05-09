import Link from "next/link";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import { PrismaClient } from '@prisma/client'
import EventCard from "@/app/components/Cards/EventCard";
const prisma = new PrismaClient()

export default async function Events(){
    const session = await getServerSession(authOptions)
    const events = await prisma.event.findMany()
    return(
        <main>
               <h1>Evenements</h1>
            {session?.user &&<Link href={"/events/new"} className={"bg-gray-800 py-2 px-4 "}>
               + Ajouter un évenement
            </Link>}
            {events.map((event) => <EventCard name={event.name}/>)}

        </main>
    )
}