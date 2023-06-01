"use client"

import GenreCard from "@/app/components/Cards/GenreCard";

interface EventCardProps {
    overflow: boolean;
    event: {
        id: string,
        name: string,
        address: {
            jsonAdress: {
                commune: string,
                rue: string,
                cp: string
            }
        },
        image: string,
        description: string,
        dateFrom: string
    },
}

export default function EventCard(props: EventCardProps): JSX.Element {
    const {event} = props
    if (!event) {
        return <p>Il' n'y à aucun évènements à venir</p>
    }
    const dateFrom = new Date(event.dateFrom);
    const options = {day: 'numeric', month: 'long'};
    const dateStr = dateFrom.toLocaleDateString('fr-FR', options);
    const eventAddress = event.address.jsonAdress
    const day = dateStr.split(' ')[0].trim();
    const month = dateStr.split(' ')[1].trim();
    return (
        <div key={event.id} id={event.id} className={"mt-3"}>
            <a href={`/events/${event.id}`} className={`h-full relative ${props.overflow ? 'w-[18rem] flex' : ""}`}>
                <h2 className={`max-[375px]:text-[5vw] ${props.overflow ? 'min-[375px]:text-md' : ""} bg-black bg-opacity-75 absolute top-1 left-1`}>
                    {event.name}</h2>
                <div className={`flex flex-col absolute p-2 h-60 justify-between w-full`} id="test">
                    <span className={"relative top-8"}>
                        <p>{eventAddress.commune}</p>
                    </span>
                    <span>
                        <span  className="absolute top-0 right-4 rounded-b-md bg-gradient-to-r from-red-600 to-red-700 shadow-inner  p-2 grid justify-items-center shadow-lg text-sm">
                            <p>{day}</p>
                            <p>{month}</p>
                        </span>

                    </span>

                </div>
                <img src={`../images/events/${event.image}`} alt={`${event.name} event`}
                     className={'object-cover w-screen h-60'}/>
            </a>

        </div>
    )
}