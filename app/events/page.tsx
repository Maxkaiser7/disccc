import Link from "next/link";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {PrismaClient} from '@prisma/client'
import EventCard from "@/app/components/Cards/EventCard";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import {Carousel} from 'react-responsive-carousel';

const prisma = new PrismaClient()

export default async function Events() {
    const session = await getServerSession(authOptions)
    const events = await prisma.event.findMany()
    const user = await prisma.user.findUnique({
        where: {
            email: session?.user?.email
        }
    })
    //trouver les évenements que l'utilisateur a like
    const likes = await prisma.likes.findMany({
        where: {
            User: {
                email: session?.user?.email
            },
            type: "event"
        }
    })
    const eventsLiked = await prisma.event.findMany({
        where: {
            id: {
                in: likes.map(like => like.eventId)
            }
        }

    })

    return (
        <main>
            {eventsLiked.length > 0 && (
                    <>
                        <h2>Vos évenements à venir</h2>
                    <div className={"flex gap-4 overflow-x-scroll"}>
                        {eventsLiked.map(event => <EventCard event={event} key={event.id} overflow={true}/>)}
                    </div>
                        </>
            )}

            <h1 className={"mb-3"}>Evenements</h1>
            {session?.user && <Link href={"/events/new"} className={"bg-gray-800 py-2 px-4"}>
                + Ajouter un évenement
            </Link>}
            {events.length == 0 && <p className={"mt-10"}>Il n'y a aucun évènements à venir</p>}
            {events.length > 0 &&
                events.map((event: object) => <EventCard event={event}/>)
            }


        </main>
    )
}