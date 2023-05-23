import axios from "axios/index";
import prisma from "@/prisma/client";
import Link from "next/link";
import {useGenreContext} from "@/pages/api/genres/GenresContext";

export default async function GenresPages() {

    const genres = await prisma.genres.findMany()
    return (
        <div>
            <h1>Genres</h1>
            <div className={"flex flex-col gap-4"}>
                {genres.map((genre) => (
                    <Link href={'/genres/' + genre.nom} key={genre.id} className={'bg-gray-800 py-2 px-4'}>{genre.nom}</Link>
                ))}
            </div>
        </div>
    )
}