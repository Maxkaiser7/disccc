import Link from "next/link";

interface ArtistCardProps {
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
        <li key={artist.id} className={"mt-10 list-none"}>
            <Link href={`/artist/${artistName}`}>
                <div key={artist.id} className={'flex flex-col items-center'}>
                    <div className={'w-96 h-96 relative'}>
                            <span
                                className={"absolute top-0 left-0 right-0 px-4 py-2 bg-black bg-opacity-50 text-white w-max"}>
                                <h2 className={"text-2xl"}>{artist.artistName}</h2>
                            </span>
                        <img src={`../images/artists/${artist.image}`} alt={`photo ${artist.artistName}`}
                             className={'w-full h-full object-cover'}/>
                    </div>
                </div>
            </Link>
        </li>
    )
}