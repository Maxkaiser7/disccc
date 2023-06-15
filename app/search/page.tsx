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
export default function searchPage(){
    const search = useSearchParams()
    const searchQuery = search?.get("search")
    const searchEncodedQuery = encodeURI(searchQuery || "")

    const { data, isLoading } = useSWR<{
        data: any;
        events: object[];
        artists: object[];
        organisations: object[];
        genres : object[];
    }>(`/api/search/getSearch?search=${searchEncodedQuery}`, fetchResponse);
    return(
        <main>
            <h1 className={"text-3xl text-center"}>Résultats</h1>
            {isLoading && <p className={"text-center"}>Chargement...</p>}
            {!isLoading && data && (
                <div className={"grid justify-center"}>
                    { data.data.events.length > 0 && data.data.events.map((event: any) => {
                        return (
                            <div>
                                <h2 className={"text-2xl"}>Evenements</h2>
                                <EventCard event={event} overflow={false} featured={false}/>
                            </div>
                        )
                    })}
                    { data.data.artists.length > 0 && data.data.artists.map((artist: any) => {
                        return (
                            <div>
                                <h2>Artiste</h2>
                                <ArtistCard overflow={false} artist={artist}/>
                            </div>
                        )
                    })}
                    { data.data.organisations.length > 0 && data.data.organisations.map((organisation: any) => {
                        return (
                            <div>
                                <h2>Organisation</h2>
                                <OrganisationCard overflow={false} organisation={organisation}/>
                            </div>
                        )
                    })}
                    {data.data.genres.length > 0 && data.data.genres.map((genre: any) => {
                        return (
                            <div>
                                <h2>Genres</h2>
                                <Link href={'/genres/' + genre.nom} key={genre.id} className={'bg-gray-800 py-2 px-4'}>{genre.nom}</Link>
                            </div>
                        )
                    })}

                </div>
            )}
        </main>
    )
}