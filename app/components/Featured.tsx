import prisma from "@/prisma/client";
import Image from "next/image";
import EventCard from "@/app/components/Cards/EventCard";
import ArtistCard from "@/app/components/Cards/ArtistCard";
import Link from "next/link";

export default async function Featured(): Promise<JSX.Element> {
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
        // @ts-ignore
        const dateStr = dateFrom.toLocaleDateString('fr-FR', options);
        // @ts-ignore
        const eventAddress = event.address.jsonAdress;
        const day = dateStr.split(' ')[0].trim();
        const month = dateStr.split(' ')[1].trim();
        const eventImage = event.image
        const eventImageSource = `/images/events/${eventImage}`
        const isEventExternalImage: any = event?.image?.startsWith("http");
        return {
            ...event,
            isEventExternalImage,
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
        const imageSrc: string = `/images/artists/${artist.image}`
        const isExternalImage: any = artist?.image?.startsWith("http");
        return{
            ...artist,
            isExternalImage,
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
    const organisationsWithNames = organisations.map((organisation) => {
        const organisationNameLower = organisation.organisationName.toLowerCase()
        const organisationName = organisationNameLower.replace(/\s+/g, "")
        const imageSrc: string = `/images/organisations/${organisation.image}`
        const isExternalImage: any = organisation?.image?.startsWith("http");
        return{
            ...organisation,
            isExternalImage,
            organisationName,
            originalName: organisation.organisationName,
    }})

    return (
        <div>
            <h2 className={"text-3xl p-8 text-center"}>A la une</h2>
            <div className={"flex justify-center"}>
                {eventsWithDates.map((event : any) => (
                    <div key={event.id}>
                        <a href={`/events/${event.id}`}>
                            <div className={"relative"}>
                                {event.isEventExternalImage && (
                                    <img src={event.image} className={"object-cover h-[17rem]"} alt={event.name}/>
                                )}
                                {!event.isEventExternalImage && (
                                    <Image
                                        alt={event.name}
                                        width={500}
                                        height={500}
                                        src={`/images/events/${event.image}`}
                                        className={"object-cover h-[17rem]"}
                                    />
                                )}

                                <h2 className={"absolute top-0 left-0 max-w-[60%] px-2 py-1 text-white bg-black bg-opacity-50 overflow-hidden text-overflow-ellipsis text-sm md:text-2xl"}>
                                    {event.name}
                                </h2>
                                <span  className="absolute top-0 right-0 rounded-b-md bg-gradient-to-r from-red-600 to-red-700  p-2 grid justify-items-center shadow-lg text-[0.8rem] md:right-4">
                                    <p>{event.day}</p>
                                    <p>{event.month}</p>
                                </span>
                            </div>
                        </a>
                    </div>
                ))}
                {artistsWithNames.map((artist) => (
                    <div key={artist.id}>
                        <Link href={`/artist/${artist.artistName}`}>
                            <div className={"relative"}>
                                {artist.isExternalImage && (
                                    <img src={artist.image} className={"object-cover h-[17rem]"} alt={artist.originalName}/>
                                )}
                                {!artist.isExternalImage &&(
                                    <Image
                                        alt={artist.originalName}
                                        width={500}
                                        height={500}
                                        src={`/images/artists/${artist.image}`}
                                        className={"object-cover h-[17rem]"}
                                    />
                                )}
                                <h2 className={"absolute top-0 left-0 max-w-[60%] px-2 py-1 text-white bg-black bg-opacity-50 overflow-hidden text-overflow-ellipsis md:text-2xl"}>{artist.originalName}</h2>
                            </div>
                        </Link>
                    </div>
                ))}
                {organisationsWithNames.map((organisation) => (
                    <div key={organisation.id}>
                        <Link href={`/organisations/${organisation.organisationName}`} className={``}>
                            <div className={"relative"}>
                                {organisation.isExternalImage && (
                                    <img src={organisation.image} className={"object-cover h-[17rem]"} alt={organisation.organisationName}/>
                                )}
                                {!organisation.isExternalImage &&(
                                    <Image
                                        alt={organisation.organisationName}
                                        width={500}
                                        height={500}
                                        src={`/images/organisations/${organisation.image}`}
                                        className={"object-cover h-[17rem]"}
                                    />
                                )}

                                <h2 className={"absolute top-0 left-0 max-w-[60%] px-2 py-1 text-white bg-black bg-opacity-50 overflow-hidden text-overflow-ellipsis md:text-2xl"}>{organisation.organisationName}</h2>
                            </div>
                        </Link>
                    </div>
                ))}


            </div>
        </div>
    )
}