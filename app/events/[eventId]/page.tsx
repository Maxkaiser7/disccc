import prisma from "@/prisma/client";

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
        }
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
            <p>Le {dateStr} à {event.Address.commune}</p>
        </div>
    );
}