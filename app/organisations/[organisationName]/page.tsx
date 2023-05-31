import prisma from "@/prisma/client";
import Image from "next/image";
import EventCard from "@/app/components/Cards/EventCard";
export default async function OrganisationPage({
                                            params,
                                            searchParams,
                                        }: {
    params: { organisationName: string };
    searchParams: { [key: string]: string | string[] | undefined };
}){
    const orgaName = params.organisationName.charAt(0).toUpperCase() + params.organisationName.slice(1)
    const organisation = await prisma.organisation.findFirst({
        where:{
            organisationName:orgaName
        }
    })
    const events = await prisma.event.findMany({
        orderBy: { createdAt: 'desc' },
        where: {
            organisation: {
                organisationName: orgaName
            },
        }
    })
    return(
        <div>
            <h2 className={"text-3xl"}>{organisation.organisationName}</h2>
            <p>{organisation.description}</p>
            <Image src={`/./images/organisations/${organisation.image}`}
                   alt={`photo ${organisation.organisationName}`}
                   width={"1000"} height={"500"}/>
            <h3 className={"mt-10"}>Evenements à venir organisés par {orgaName}</h3>
            {events.length > 0 && events.map((event: object ) => <EventCard event={event}/>)}
        </div>
    )
}