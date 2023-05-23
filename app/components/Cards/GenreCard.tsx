"use client"
import Link from "next/link";

interface GenreCardProps {
    genre: {
        id: string,
        nom: string,
    }
}

export default function GenreCard(propsgenre: GenreCardProps): JSX.Element {
    const {genre} = propsgenre
    return (
        <div key={genre.id} className={"h-12 mt-3"}>
            <Link key={genre.nom} href={`/genres/${genre.nom}`} className={"bg-slate-800 pt-2 pb-2 pl-4 pr-4"}>{genre.nom}</Link>
        </div>
    )
}