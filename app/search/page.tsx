"use client"
import {useSearchParams} from "next/navigation";
import useSWR from "swr";
import EventCard from "@/app/components/Cards/EventCard";
import ArtistCard from "@/app/components/Cards/ArtistCard";
import OrganisationCard from "@/app/components/Cards/OrganisationCard";
import Link from "next/link";
const fetchResponse = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return response.json();
}
export default function searchPage() {
    const search = useSearchParams();
    const searchQuery = search?.get("search");
    const searchEncodedQuery = encodeURI(searchQuery || "");

    const { data, isLoading } = useSWR<{
        message: string;
        data: {
            events: object[];
            artists: { id: string; artistName: string }[]; // Update the type definition for artists
            organisations: object[];
            genres: object[];
            relativeArtists: object[];
            relativeEvents: object[];
        };
    }>(`/api/search/getSearch?search=${searchEncodedQuery}`, fetchResponse);

    console.log(data);

    // @ts-ignore
    // @ts-ignore
    return (
        <main>
            <h1 className={"text-3xl text-center"}>Résultats</h1>
            {isLoading && <p className={"text-center"}>Chargement...</p>}
            {!isLoading && data && (
                <div className={"grid justify-center"}>
                    {data.data.events.length > 0 &&
                        data.data.events.map((event: any) => {
                            return (
                                <div className={"relative"}>
                                    <EventCard event={event} overflow={false} featured={false} />
                                    <h2 className={"text-2xl absolute bottom-[0.75rem] bg-indigo-600 p-1 index-5"}>
                                        Evenement
                                    </h2>
                                </div>
                            );
                        })}
                    {data.data.artists.length > 0 &&
                        data.data.artists.map((artist: any) => {
                            return (
                                <div className={"relative"}>
                                    <ArtistCard overflow={false} artist={artist} />
                                    <h2 className={"text-2xl absolute bottom-[0] left-[9rem] bg-sky-600 p-1 index-5"}>
                                        Artiste
                                    </h2>
                                </div>
                            );
                        })}
                    {data.data.organisations.length > 0 &&
                        data.data.organisations.map((organisation: any) => {
                            return (
                                <div className={"relative"}>
                                    <OrganisationCard overflow={false} organisation={organisation} />
                                    <h2 className={"text-2xl absolute bottom-[0.75rem] bg-orange-600 p-1 index-5"}>
                                        Organisation
                                    </h2>
                                </div>
                            );
                        })}
                    {data.data.genres.length > 0 &&
                        data.data.genres.map((genre: any) => {
                            return (
                                <div key={genre.id}>
                                    <h2>Genres</h2>
                                    <Link href={"/genres/" + genre.nom} className={"bg-gray-800 py-2 px-4"}>
                                        {genre.nom}
                                    </Link>
                                </div>
                            );
                        })}

                    {data.data.relativeArtists.length > 0 && (
                        <div className={"mt-14"}>
                            <h2>Artistes du même style que {data.data.artists[0].artistName}</h2>
                            <div className={"flex gap-2"}>
                                {data.data.relativeArtists.map((artist: any) => (
                                    <Link href={"/artists/" + artist.id} key={artist.id} className={"bg-gray-800 py-2 px-4"}>
                                        {artist.artistName}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                    {data.data.relativeEvents.length > 0 && (
                        <div className={"mt-14"}>
                            <h2>Evenements qui pourraient vous plaire</h2>
                            <div className={"flex gap-2"}>
                                {data.data.relativeEvents.map((event: any) => (
                                    <Link href={"/events/" + event.id} key={event.id} className={"bg-gray-800 py-2 px-4"}>
                                        {event.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </main>
    );
}
