"use client"
import { useEffect, useState } from "react";
import axios from "axios";

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
                console.log(events)
            } catch (err) {
                console.log(err);
            }
        };
        fetchEvents();
    }, [currentPage, itemsPerPage]);

    const deleteEvent = async (eventId: number) => {
        try {
            await axios.post("/api/event/deleteEvent/", {
                params: { eventId },
            });
            setEvents((prevEvents) =>
                prevEvents.filter((event) => event.id !== eventId)
            );

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
        <div className="overflow-x-auto">
            <table className="table-auto border-collapse border-white border">
                <thead>
                <tr>
                    <th className="px-4 py-2">id</th>
                    <th className="px-4 py-2">description</th>
                    <th className="px-4 py-2">name</th>
                    <th className="px-4 py-2">unsignedArtists</th>
                    <th className="px-4 py-2">image</th>
                    <th className="px-4 py-2">User</th>
                    <th className="px-4 py-2">userId</th>
                    <th className="px-4 py-2">createdAt</th>
                    <th className="px-4 py-2">dateFrom</th>
                    <th className="px-4 py-2">dateTo</th>
                    <th className="px-4 py-2">price</th>
                    <th className="px-4 py-2">facebookLink</th>
                    <th className="px-4 py-2">adress</th>
                    <th className="px-4 py-2">Comments</th>
                    <th className="px-4 py-2">ArtistsOnEvents</th>
                    <th className="px-4 py-2">genres</th>
                    <th className="px-4 py-2">genresId</th>
                    <th className="px-4 py-2">unsignedOrganisation</th>
                    <th className="px-4 py-2">artist</th>
                    <th className="px-4 py-2">artistId</th>
                    <th className="px-4 py-2">organisation</th>
                    <th className="px-4 py-2">organisationId</th>
                    <th className="px-4 py-2">Likes</th>
                    <th className="px-4 py-2">isPromoted</th>
                    <th className="px-4 py-2">endPromotion</th>
                    <th className="px-4 py-2">Notification</th>
                    <th className="px-4 py-2">Post</th>
                    <th className="px-4 py-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                {events.map((event) => (
                    <tr key={event.id}>
                        <td className="border px-4 py-2">{event.id}</td>
                        <td className="border px-4 py-2">{event.description}</td>
                        <td className="border px-4 py-2">{event.name}</td>
                        <td className="border px-4 py-2">{event.unsignedArtists}</td>
                        <td className="border px-4 py-2">
                            <img src={event.image} alt="Event" />
                        </td>
                        <td className="border px-4 py-2">{event.User}</td>
                        <td className="border px-4 py-2">{event.userId}</td>
                        <td className="border px-4 py-2">{event.createdAt}</td>
                        <td className="border px-4 py-2">{event.dateFrom}</td>
                        <td className="border px-4 py-2">{event.dateTo}</td>
                        <td className="border px-4 py-2">{event.price}</td>
                        <td className="border px-4 py-2">{event.facebookLink}</td>
                        <td className="border px-4 py-2">
                            {event.address && (
                                <>
                                    <div>Street: {event.address.jsonAdress.rue}</div>
                                    <div>City: {event.address.jsonAdress.commune}</div>
                                    <div>Postal Code: {event.address.jsonAdress.cp}</div>
                                </>
                            )}
                        </td>
                        <td className="border px-4 py-2">{event.Comments}</td>
                        <td className="border px-4 py-2">{event.ArtistsOnEvents}</td>
                        <td className="border px-4 py-2">{event.genres}</td>
                        <td className="border px-4 py-2">{event.genresId}</td>
                        <td className="border px-4 py-2">{event.unsignedOrganisation}</td>
                        <td className="border px-4 py-2">{event.artist}</td>
                        <td className="border px-4 py-2">{event.artistId}</td>
                        <td className="border px-4 py-2">{event.organisation}</td>
                        <td className="border px-4 py-2">{event.organisationId}</td>
                        <td className="border px-4 py-2">{event.Likes}</td>
                        <td className="border px-4 py-2">{event.isPromoted}</td>
                        <td className="border px-4 py-2">{event.endPromotion}</td>
                        <td className="border px-4 py-2">{event.Notification}</td>
                        <td className="border px-4 py-2">{event.Post}</td>
                        <td className="border px-4 py-2">
                            <button
                                onClick={() => deleteEvent(event.id)}
                                className="text-red-500 hover:text-red-700"
                            >
                                &#10006; {/* Croix de suppression */}
                            </button>
                        </td>
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