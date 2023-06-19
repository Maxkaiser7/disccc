"use client"
import { useEffect, useState } from "react";
import axios from "axios";
import EventCard from "@/app/components/Cards/EventCard";

export default function EventsPagination() {
    const [events, setEvents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get("/api/event/getEvents", {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    params: {
                        page: currentPage,
                        limit: itemsPerPage,
                    },
                });
                setEvents(response.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchEvents();
    }, [currentPage, itemsPerPage]);

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    return (
        <div className="overflow-x-auto">
            <div className="flex flex-wrap justify-center gap-4">
                {events.length === 0 ? (
                    <p>Aucun événement à afficher pour le moment.</p>
                ) : (
                    events.map((event: any) => (
                        <EventCard event={event} key={event.id} overflow={false}  featured={false}/>
                    ))
                )}
            </div>
            <div className={"flex justify-center gap-2"}>
                <button onClick={goToPreviousPage} disabled={currentPage === 1}>
                    Précédent
                </button>
                <span>{currentPage}</span>
                <button onClick={goToNextPage}>Suivant</button>
            </div>
        </div>
    );
}
