import GenreCard from "@/app/components/Cards/GenreCard";
import Link from "next/link";
import Image from "next/image";

interface EventCardProps {
    overflow: boolean;
    featured: boolean;
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
        dateFrom: string,
        facebookLink: string
    },
}
export default function EventCard(props: EventCardProps): JSX.Element {
    const {event} = props
    if (!event) {
        return <p>Il' n'y à aucun évènements à venir</p>
    }
    const dateFrom = new Date(event.dateFrom);
    const options = {day: 'numeric', month: 'long'};
    // @ts-ignore
    const dateStr = dateFrom.toLocaleDateString('fr-FR', options);
    const eventAddress = event.address.jsonAdress
    const day = dateStr.split(' ')[0].trim();
    const month = dateStr.split(' ')[1].trim();

    const imageClassname = `${props.featured ? "object-cover w-10/12" : "object-cover w-screen h-60"}`
    const imageSource = `/./images/events/${event.image}`
    return (
        <div key={event.id} id={event.id} className={"mb-3 max-w-[25rem] lg:max-w-[30rem]"}>
            <a href={`/events/${event.id}`}
               className={`h-full relative ${props.overflow ? 'w-[18rem] flex' : ""} ${props.featured ? 'w-[6rem] h-[6rem] flex' : ""}`}>
                <h2 className={`max-[375px]:text-[5vw]  ${props.overflow ? 'min-[375px]:text-md' : "text-3xl"} bg-black bg-opacity-75 absolute top-1 left-1`}>
                    {event.name}</h2>
                <div className={`flex flex-col absolute p-2 h-60 justify-between w-full`} id="test">
                    <span className={`relative top-8 ${props.overflow ? 'max-[375px]:text-md' : "text-3xl"}`}>
                        <p>{eventAddress.commune}</p>
                    </span>
                    <span>
                        <span
                            className="absolute top-0 right-4 rounded-b-md bg-gradient-to-r from-red-600 to-red-700 shadow-inner  p-2 grid justify-items-center shadow-lg text-sm">
                            <p>{day}</p>
                            <p>{month}</p>
                        </span>
                    </span>
                </div>
                <Image src={imageSource}
                       alt={event.name}
                       className={imageClassname}
                       width={500} height={500}/>

            </a>
        </div>
    )
}