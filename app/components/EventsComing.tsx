"use client"
import prisma from "@/prisma/client";
import {useEffect, useState} from "react";
import axios from "axios";
import EventCard from "@/app/components/Cards/EventCard";
import Link from "next/link";

export default function EventsComing(){
    const [events, setEvents] = useState([]);
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get("/api/event/getLastEvents", {
                    headers: {
                        "Content-Type": "application/json",
                    }
                })
                setEvents(response.data)
            } catch (err) {
                console.log(err);
            }
        };
        fetchEvents();
    }, []);

    return(
        <div className={"mt-10 p-8"}>
            <h3 className={"text-3xl text-center"}>Evenements à venir</h3>
            {events.length === 0 && (
                <p>Aucun évènement à venir</p>
            )}
            <div className={"md:flex md:flex-wrap md:justify-center md:gap-4  grid justify-center"}>
                {events.map((event: object ) => <EventCard event={event} overflow={false}/>)}
            </div>
            <span className={"flex justify-center"}>
            <Link href={"/events"} className={"mt-10 text-center bg-slate-800 text-white px-4 py-2"}>Voir plus</Link>
            </span>
        </div>
    )
}