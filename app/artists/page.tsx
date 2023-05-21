import prisma from "@/prisma/client";
import ArtistCard from "@/app/components/Cards/ArtistCard";
import SearchArtist from "@/app/artists/SearchArtist";

export default async function getArtists(){

    return (
        <div className={"p-2"}>
            <h2 className={"text-3xl"}>Découvrez les artistes</h2>
            <SearchArtist/>
        </div>
    );
}