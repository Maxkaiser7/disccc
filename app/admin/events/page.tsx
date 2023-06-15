"use client"
import {useEffect, useState} from "react";
import axios from "axios";
import {BsFillTrashFill} from "react-icons/bs";

interface Event {
    id: number;
    description: string;
    name: string;
    unsignedArtists: string;
    image: string;
    User: string;
    userId: number;
    createdAt: string;
    dateFrom: string;
    dateTo: string;
    price: number;
    facebookLink: string;
    address: string;
    Comments: string;
    ArtistsOnEvents: string;
    genres: string;
    genresId: number;
    unsignedOrganisation: string;
    artist: string;
    artistId: number;
    organisation: string;
    organisationId: number;
    Likes: number;
    isPromoted: boolean;
    endPromotion: string;
    Notification: string;
    Post: string;
}

export default function EventTable() {
    const [events, setEvents] = useState<Event[]>([]);
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

    const deleteEvent = async (eventId: number) => {
        try {
            const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer cet événement ?");

            if (confirmed) {
                await axios.post("/api/event/deleteEvent/", {
                    params: { eventId },
                });
                setEvents((prevEvents) =>
                    prevEvents.filter((event) => event.id !== eventId)
                );
            }
        } catch (err) {
            console.log(err);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    return (
        <div className={"w-full p-8 overflow-x-scroll"}>
            <table className="table-auto border-collapse border-white border text-xs font-light ">
                <thead>
                <tr className={"bg-slate-700 "}>
                    <th className="px-4 py-2 whitespace-nowrap">action</th>
                    <th className="px-4 py-2 whitespace-nowrap">description</th>
                    <th className="px-4 py-2 whitespace-nowrap">name</th>
                    <th className="px-4 py-2 whitespace-nowrap">unsignedArtists</th>
                    <th className="px-4 py-2 whitespace-nowrap">createdAt</th>
                    <th className="px-4 py-2 whitespace-nowrap">dateFrom</th>
                    <th className="px-4 py-2 whitespace-nowrap">dateTo</th>
                    <th className="px-4 py-2 whitespace-nowrap">price</th>
                    <th className="px-4 py-2 whitespace-nowrap">facebookLink</th>
                    <th className="px-4 py-2 whitespace-nowrap">adress</th>
                    <th className="px-4 py-2 whitespace-nowrap">ArtistsOnEvents</th>
                    <th className="px-4 py-2 whitespace-nowrap">genres</th>
                    <th className="px-4 py-2 whitespace-nowrap">unsignedOrganisation</th>
                    <th className="px-4 py-2 whitespace-nowrap">organisation</th>
                    <th className="px-4 py-2 whitespace-nowrap">Likes</th>
                    <th className="px-4 py-2 whitespace-nowrap">isPromoted</th>
                    <th className="px-4 py-2 whitespace-nowrap">endPromotion</th>
                </tr>
                </thead>
                <tbody>
                {events.map((event) => (
                    <tr key={event.id}>
                        <td className="border px-4 py-2 whitespace-nowrap">
                            <button
                                onClick={() => deleteEvent(event.id)}
                            >
                                <BsFillTrashFill/>
                            </button>
                        </td>
                        <td className="border px-4 py-2 whitespace-nowrap">{event.description ? event.description.slice(0, 10) + "..." : "N/A"}</td>
                        <td className="border px-4 py-2 whitespace-nowrap">{event.name}</td>
                        <td className="border px-4 py-2 whitespace-nowrap">{event.unsignedArtists ? event.unsignedArtists.slice(0, 10) : "N/A"}</td>
                        <td className="border px-4 py-2 whitespace-nowrap">{event.createdAt ? new Date(event.createdAt).toLocaleDateString() : "N/A"}</td>
                        <td className="border px-4 py-2 whitespace-nowrap">{event.dateFrom ? new Date(event.dateFrom).toLocaleDateString() : "N/A"}</td>
                        <td className="border px-4 py-2 whitespace-nowrap">{event.dateTo ? new Date(event.dateTo).toLocaleDateString() : "N/A"}</td>
                        <td className="border px-4 py-2 whitespace-nowrap">{event.price}</td>
                        <td className="border px-4 py-2 whitespace-nowrap">{event.facebookLink ? event.facebookLink.slice(0, 10) + "..." : "N/A"}</td>
                        <td className="border px-4 py-2 whitespace-nowrap">
                            {event.address && (
                                <>
                                    <div>Street: {event.address.jsonAdress.rue ? event.address.jsonAdress.rue.slice(0, 10) + "..." : "N/A"}</div>
                                    <div>City: {event.address.jsonAdress.commune}</div>
                                    <div>Postal Code: {event.address.jsonAdress.cp}</div>
                                </>
                            )}
                        </td>
                        <td className="border px-4 py-2 whitespace-nowrap">{event.ArtistsOnEvents}</td>
                        <td className="border px-4 py-2 whitespace-nowrap">{event.genres}</td>
                        <td className="border px-4 py-2 whitespace-nowrap">{event.unsignedOrganisation}</td>
                        <td className="border px-4 py-2 whitespace-nowrap">{event.organisation}</td>
                        <td className="border px-4 py-2 whitespace-nowrap">{event.Likes}</td>
                        <td className="border px-4 py-2 whitespace-nowrap">{event.isPromoted}</td>
                        <td className="border px-4 py-2 whitespace-nowrap">{event.endPromotion}</td>

                    </tr>
                ))}
                </tbody>

            </table>
            <div className={"flex justify-center"}>
                <button onClick={goToPreviousPage} disabled={currentPage === 1}>
                    Précédent
                </button>
                <span>{currentPage}</span>
                <button onClick={goToNextPage}>Suivant</button>
            </div>
        </div>
    );
}