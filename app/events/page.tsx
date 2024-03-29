import Link from "next/link";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {PrismaClient} from '@prisma/client'
import EventCard from "@/app/components/Cards/EventCard";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import {Carousel} from 'react-responsive-carousel';
import EventsPagination from "@/app/components/EventsPagination";
export const dynamic = 'force-dynamic'
const prisma = new PrismaClient()

export default async function Events() {
    const session = await getServerSession(authOptions)
   // const events = await prisma.event.findMany()
    let user: any = []
    let likes: any = []
    //let eventsLiked: any = []
         user = await prisma.user.findUnique({
            where: {
                // @ts-ignore
                email: session?.user?.email
            }
        })
        likes = await prisma.likes.findMany({
            where: {
                userId: user.id,
                type: "event"
            }
        })
        const likeIds = likes
            .filter((like: any) => like.userId === user.id && like.type === 'event')
            .map((like : any) => like.eventId);

        console.log(likeIds)

        const eventsLiked = await prisma.event.findMany({
            where: {
                id: {
                    in: likeIds,
                },
            },
        });
        console.log(likeIds)



    console.log(eventsLiked)

    return (
        <main>
            {eventsLiked.length > 0 && (
                <>
                    <h2 className={"text-3xl text-center"}>Vos évenements à venir</h2>
                    <div className={"flex gap-4  justify-center"}>
                        {eventsLiked.map((event : any) =>
                            <EventCard featured={false} event={event} key={event.id} overflow={true}/>
                        )}
                    </div>
                </>
            )}

            <h1 className={"mb-3 text-3xl text-center"}>Evenements</h1>
            <span className={"flex justify-center"}>
            {session?.user && <Link href={"/events/new"} className={"bg-gray-800 py-2 px-4 mb-8"}>
                + Ajouter un évenement
            </Link>}
            </span>
            <EventsPagination/>

        </main>
    )
}