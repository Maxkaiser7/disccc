import Link from "next/link";

interface ArtistCardProps {
    overflow: boolean;
    artist: {
        id: string,
        artistName: string,
        image: string,
        description: string,
    }
}
export default function ArtistCard(props: ArtistCardProps) : JSX.Element{
    const {artist} = props
    const artistNameLower = artist.artistName.toLowerCase()
    const artistName = artistNameLower.replace(/\s+/g, "")
    return (
        <li key={artist.id} className={`list-none ${props.overflow ? "" : ""}`}>
            <Link href={`/artist/${artistName}`}>
                <div key={artist.id} className={`relative ${props.overflow ? "" :"flex flex-col items-center"}`}>
                    <div className={'relative'}>
                            <span
                                className={"absolute top-0 left-0 right-0 px-4 py-2 bg-black bg-opacity-50 text-white w-max"}>
                                <h2 className={"text-2xl"}>{artist.artistName}</h2>
                            </span>
                        <img src={`../images/artists/${artist.image}`} alt={`photo ${artist.artistName}`}
                             className={`object-cover ${props.overflow ? "" : "w-full h-full"}`}/>
                    </div>
                </div>
            </Link>
        </li>
    )
}