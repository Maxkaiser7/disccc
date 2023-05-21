"use client"
import prisma from "@/prisma/client";
import {useEffect, useState} from "react";
import axios from "axios";
import EventCard from "@/app/components/Cards/EventCard";

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
        <div>
            <h2>Evenements à venir</h2>
            {events.map((event: object ) => <EventCard event={event}/>)}

        </div>
    )
}