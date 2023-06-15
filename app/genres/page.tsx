import axios from "axios/index";
import prisma from "@/prisma/client";
import Link from "next/link";

export default async function GenresPages() {

    const genres = await prisma.genres.findMany()
    return (
        <main className={"mb-[56vh]"}>
            <h1 className={"text-center text-3xl"}>Genres</h1>
            <div className={"flex gap-4  justify-center"}>
                {genres.map((genre) => (
                    <Link href={'/genres/' + genre.nom} key={genre.id} className={'bg-gray-800 py-2 px-4'}>{genre.nom}</Link>
                ))}
            </div>
        </main>
    )
}