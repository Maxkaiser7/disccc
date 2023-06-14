import prisma from "@/prisma/client";
import Link from "next/link";
import ArtistCard from "@/app/components/Cards/ArtistCard";

async function getLastArtists (){
    /*const response = await axios.get("/api/artists/getLastArtists", {
        headers: {
            "Content-Type": "application/json",
        }
    })*/
    return prisma.artist.findMany({
        take: 4,
        orderBy: {
            createdAt: "desc"
        }
    });
}
export default async function GetArtists() {
    //const [artists, setArtists] = useState([]);
    /*useEffect(() => {
        const fetchArtists = async () => {
            try {
                const response = await axios.get("/api/artists/getLastArtists", {
                    headers: {
                        "Content-Type": "application/json",
                    }
                })
                setArtists(response.data)
            } catch (err) {
                console.log(err);
            }
        };
        fetchArtists();
    }, []);*/
    const artistData = getLastArtists()
    const [artists] = await Promise.all([artistData])
    return (
        <div className={"mt-10 p-8"}>
            <h2 className={"text-3xl text-center"}>Derniers artistes inscrits</h2>
            <div className={"md:flex md:flex-wrap md:justify-center md:gap-4"}>

            {artists.length === 0 ? (
                <p>Aucun artiste à afficher pour le moment.</p>
            ) : (
                artists.map((artist) => (
                    <ArtistCard artist={artist}/>
                ))
            )}
            </div>
            <span className={"flex justify-center"}>
                <Link href={"/artists"} className={"mt-10 text-center bg-slate-800 text-white px-4 py-2"}>Voir plus</Link>
            </span>
        </div>
    )
}