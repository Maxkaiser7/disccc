import prisma from "@/prisma/client";
import Image from "next/image";
import EventCard from "@/app/components/Cards/EventCard";
import ArtistCard from "@/app/components/Cards/ArtistCard";

export default async function Featured(): JSX.Element {
    //récupération de la date et conversion en format ISO
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().replace("T", " ").split(".")[0];
    const formattedEndDate = new Date(formattedDate);

    const events = await prisma.event.findMany({
        where: {
            isPromoted: true,
            /*
            endPromotion: {
                gte: formattedEndDate
            }

             */
        },
    })
    const eventsWithDates = events.map((event) => {
        const dateFrom = new Date(event.dateFrom);
        const options = {day: 'numeric', month: 'long'};
        const dateStr = dateFrom.toLocaleDateString('fr-FR', options);
        const eventAddress = event.address.jsonAdress;
        const day = dateStr.split(' ')[0].trim();
        const month = dateStr.split(' ')[1].trim();

        return {
            ...event,
            day,
            month,
        };
    });
    const artists = await prisma.artist.findMany({
        where: {
            isPromoted: true,
            endPromotion: {
                gte: formattedEndDate
            }
        },
    })
    const artistsWithNames = artists.map((artist) => {
        const artistNameLower = artist.artistName.toLowerCase()
        const artistName = artistNameLower.replace(/\s+/g, "")
        return{
            ...artist,
            artistName,
            originalName: artist.artistName,

        }
    })


    const organisations = await prisma.organisation.findMany({
        where: {
            isPromoted: true,
            endPromotion: {
                gte: formattedEndDate
            }
        },
    });



    return (
        <div>
            <h2 className={"text-3xl"}>A la une</h2>
            <div className={"flex "}>
                {eventsWithDates.map((event) => (
                    <div key={event.id}>
                        <a href={`/events/${event.id}`} className={``}>
                            <div className={"relative"}>
                                <Image
                                    alt={event.name}
                                    width={500}
                                    height={500}
                                    src={`/images/events/${event.image}`}
                                    className={"object-cover h-[17rem] w-60"}
                                />
                                <h2 className={"absolute top-0 left-0 max-w-[60%] px-2 py-1 text-white bg-black bg-opacity-50 overflow-hidden text-overflow-ellipsis text-sm"}>
                                    {event.name}
                                </h2>
                                <span  className="absolute top-0 right-4 rounded-b-md bg-gradient-to-r from-red-600 to-red-700  p-2 grid justify-items-center shadow-lg text-[0.8rem]">
                                    <p>{event.day}</p>
                                    <p>{event.month}</p>
                                </span>
                            </div>
                        </a>
                    </div>
                ))}
                {artistsWithNames.map((artist) => (
                    <div key={artist.id}>
                        <a href={`/artist/${artist.artistName}`} className={``}>
                            <div className={"relative"}>
                                <Image
                                    alt={artist.originalName}
                                    width={500}
                                    height={500}
                                    src={`/images/artists/${artist.image}`}
                                    className={"object-cover h-[17rem] w-60"}
                                />
                                <h2 className={"absolute top-0 left-0 max-w-[60%] px-2 py-1 text-white bg-black bg-opacity-50 overflow-hidden text-overflow-ellipsis"}>{artist.originalName}</h2>
                            </div>
                        </a>
                    </div>
                ))}
                {organisations.map((organisation) => (
                    <div key={organisation.id}>
                        <a href={`/organisations/${organisation.organisationName}`} className={``}>
                            <div className={"relative"}>
                                <Image
                                    alt={organisation.name}
                                    width={500}
                                    height={500}
                                    src={`/images/organisations/${organisation.image}`}
                                    className={"object-cover h-[17rem] w-60"}
                                />
                                <h2 className={"absolute top-0 left-0 max-w-[60%] px-2 py-1 text-white bg-black bg-opacity-50 overflow-hidden text-overflow-ellipsis"}>{organisation.organisationName}</h2>
                            </div>
                        </a>
                    </div>
                ))}


            </div>
        </div>
    )
}