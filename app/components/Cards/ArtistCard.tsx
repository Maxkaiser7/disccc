import Link from "next/link";
import Image from "next/image";
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
    const imageClassname : string = `object-cover ${props.overflow ? "h-[19rem]" : "w-full h-[17rem]"}`
    const imageSrc: string = `/images/artists/${artist.image}`
    return (
        <li key={artist.id} className={`mb-3 list-none ${props.overflow ? "" : ""}`}>
            <Link href={`/artist/${artistName}`}>
                <div key={artist.id} className={`relative ${props.overflow ? "w-[15rem] flex md:w-auto" :"flex flex-col items-center"}`}>
                    <div className={'relative w-96'}>
                            <span
                                className={"absolute top-0 left-0 right-0 px-4 py-2 bg-black bg-opacity-50 text-white w-max"}>
                                <h2 className={"text-3xl"}>{artist.artistName}</h2>
                            </span>
                        <Image alt={artist.artistName}
                               src={imageSrc}
                               className={imageClassname} width={500}
                               height={500} />
                    </div>
                </div>
            </Link>
        </li>
    )
}