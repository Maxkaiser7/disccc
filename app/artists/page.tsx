import prisma from "@/prisma/client";
import ArtistCard from "@/app/components/Cards/ArtistCard";
import SearchArtist from "@/app/artists/SearchArtist";
import GetLikedArtists from "@/app/components/GetLikedArtists";
export default async function getArtists(){

    return (
        <div className={"p-2"}>
            <GetLikedArtists/>
            <SearchArtist/>
        </div>
    );
}