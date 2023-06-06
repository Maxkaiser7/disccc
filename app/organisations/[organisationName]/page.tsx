"use client"
import prisma from "@/prisma/client";
import Image from "next/image";
import EventCard from "@/app/components/Cards/EventCard";
import LikeButton from "@/app/components/LikeButton";
import {useEffect, useState} from "react";
import {getSession} from "next-auth/react";
import axios from "axios";
import {log} from "util";
export default function OrganisationPage({
                                            params,
                                            searchParams,
                                        }: {
    params: { organisationName: string };
    searchParams: { [key: string]: string | string[] | undefined };
}){
    const [isLiked, setIsLiked] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [events, setEvents] = useState<any>(null);
    const [organisation, setOrganisation] = useState<any>(null);


    const orgaName = params.organisationName.charAt(0).toUpperCase() + params.organisationName.slice(1)
    const url = `/api/organisations/getOrganisation?organisationName=${encodeURIComponent(orgaName)}`;
    const fetchData = async () => {
        const response = await fetch(url);
        const data = await response.json();
        const organisationData = data.organisation
        const eventsData = data.events;
        const liked = data.like
        if (liked) {
            setIsLiked(true)
        }
        setEvents(eventsData);
        setOrganisation(organisationData)
        setIsLoading(false)
    }
    useEffect(() => {
        fetchData();
    }, []);


    const handleLike = async () => {
        setIsLiked(!isLiked)
        const session = await getSession();
        const response = await axios.post("/api/organisations/addLike", {
            params: {organisation, session},
        });
    }
    /* const organisation = await prisma.organisation.findFirst({
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
     })*/
    return(
        <div>
            {isLoading ? (<p>Chargement...</p>)
            : (
                    <div>
                        <h2 className={"text-3xl"}>{organisation.organisationName}</h2>
                        <p>{organisation.description}</p>

                        <div className={"relative"}>
                            <Image src={`/./images/organisations/${organisation.image}`}
                                   alt={`photo ${organisation.organisationName}`}
                                   width={"1000"} height={"500"}/>
                            <div className={"absolute bottom-2 right-2"}>
                                <LikeButton clickEvent={handleLike} isLiked={isLiked}/>
                            </div>
                        </div>
                        <h3 className={"mt-10"}>Evenements à venir organisés par {orgaName}</h3>
                        {events.length > 0 && events.map((event: object ) => <EventCard event={event}/>)}
                        {events.length === 0 && (
                            <p>Aucun évènement à venir</p>
                        )}
                    </div>
                )}
        </div>

    )

}