"use client"
import {useSearchParams} from "next/navigation";
import useSWR from "swr";
import EventCard from "@/app/components/Cards/EventCard";
import ArtistCard from "@/app/components/Cards/ArtistCard";
import OrganisationCard from "@/app/components/Cards/OrganisationCard";
const fetchResponse = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return response.json();
}
export default function searchPage(){
    const search = useSearchParams()
    const searchQuery = search?.get("search")
    const searchEncodedQuery = encodeURI(searchQuery || "")

    const { data, isLoading } = useSWR<{
        data: any;
        events: object[];
        artists: object[];
        organisations: object[];
    }>(`/api/search/getSearch?search=${searchEncodedQuery}`, fetchResponse);
    return(
        <main>
            <h1>Résultats</h1>
            {isLoading && "Chargement"}
            {!isLoading && data && (
                <div>
                    { data.data.events.length > 0 && data.data.events.map((event: Array<object>) => {
                        return (
                            <div>
                                <h2>Evenements</h2>
                                <EventCard event={event} overflow={false}/>
                            </div>
                        )
                    })}
                    { data.data.artists.length > 0 && data.data.artists.map((artist: Array<object>) => {
                        return (
                            <div>
                                <h2>Artistes</h2>
                                <ArtistCard overflow={false} artist={artist}/>
                            </div>
                        )
                    })}
                    { data.data.organisations.length > 0 && data.data.organisations.map((organisation: Array<object>) => {
                        return (
                            <div>
                                <h2>Organisations</h2>
                                <OrganisationCard overflow={false} organisation={organisation}/>
                            </div>
                        )
                    })}

                </div>
            )}
        </main>
    )
}