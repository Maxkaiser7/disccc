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
               <h1 className={"mb-3"}>Evenements</h1>
            {session?.user &&<Link href={"/events/new"} className={"bg-gray-800 py-2 px-4"}>
               + Ajouter un évenement
            </Link>}
            {events.length == 0 && <p className={"mt-10"}>Il n'y a aucun évènements à venir</p>}
            {events.length > 0 &&
                events.map((event: object ) => <EventCard event={event}/>)
            }


        </main>
    )
}