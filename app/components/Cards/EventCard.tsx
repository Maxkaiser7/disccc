"use client"

import GenreCard from "@/app/components/Cards/GenreCard";

interface EventCardProps {
    event: {
        id: string,
        name: string,
        address: {
            jsonAdress:{
                commune: string,
                rue: string,
                cp: string
            }
        },
        image: string,
        description: string,
        dateFrom: string
    }
}

export default function EventCard(props: EventCardProps): JSX.Element {
    const {event} = props
    if(!event){
        return <p>Il' n'y à aucun évènements à venir</p>
    }
    const dateFrom = new Date(event.dateFrom);
    const options = { day: 'numeric', month: 'long' };
    const dateStr = dateFrom.toLocaleDateString('fr-FR', options);
    const eventAddress = event.address.jsonAdress
    return (
        <div key={event.id} id={event.id} className={"mt-3"}>
            <a href={`/events/${event.id}`} className={"h-full"}>
                <div className={"flex flex-col absolute p-2 w-11/12 h-60 justify-between"} id={"test"}>
                    <span>
                        <h2 className={"text-2xl bg-black bg-opacity-75"}>{event.name}</h2>
                        <p>{dateStr}</p>
                    </span>
                    <span>
                        <p>{eventAddress.commune}</p>
                    </span>
                </div>
                <img src={`../images/events/${event.image}`} alt={`${event.name} event`}
                     className={'object-cover w-screen h-60'}/>
            </a>

        </div>
    )
}