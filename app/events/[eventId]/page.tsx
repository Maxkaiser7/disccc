import prisma from "@/prisma/client";
import GenreCard from "@/app/components/Cards/GenreCard";

export default async function EventPage({
                                      params,
                                      searchParams,
                                  }: {
    params: { eventId: string };
    searchParams: { [key: string]: string | string[] | undefined };
}) {


    const event = await prisma.event.findUnique({
        where: {
            id: params.eventId
        },
    })

    const genres = await prisma.genres.findMany({
        where: {
            Event: {
                some: {
                    id: event?.id,
                },
            },
        },
    })
    const dateFrom = event.dateFrom
    const options = { day: 'numeric', month: 'long' };
    const dateStr = dateFrom.toLocaleDateString('fr-FR', options);
    return (
        <div>
            <h2>{event.name}</h2>
            <img src={`../images/events/${event.image}`} alt={`${event.name} event`}
                 className={'object-cover w-screen h-60'}/>
            <p>{event.description}</p>
            {genres.length > 0 && genres.map((genre: object) => <GenreCard genre={genre}/>)}
        </div>
    );
}