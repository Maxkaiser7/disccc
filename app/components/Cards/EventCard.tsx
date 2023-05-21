"use client"

interface EventCardProps {
    event: {
        id: string,
        name: string,
        Address: {
            commune: string
        },
        image: string,
        description: string,
        dateFrom: string
    }
}

export default function EventCard(props: EventCardProps): JSX.Element {
    const {event} = props

    const dateFrom = new Date(event.dateFrom);
    const options = { day: 'numeric', month: 'long' };
    const dateStr = dateFrom.toLocaleDateString('fr-FR', options);
    return (
        <div key={event.id} id={event.id} className={"mt-10"}>
            <a href={`/events/${event.id}`}>
                <span className={"flex flex-col absolute p-2 w-11/12"}>
                    <h2 className={"text-2xl bg-black bg-opacity-75"}>{event.name}</h2>
                    <p>{dateStr}</p>
                    <p>{event.Address.commune}</p>
            </span>
                <img src={`../images/events/${event.image}`} alt={`${event.name} event`}
                     className={'object-cover w-screen h-60'}/>
            </a>
        </div>
    )
}