"use client"
import {useEffect, useState} from "react";
import axios from "axios";
import EventCard from "@/app/components/Cards/EventCard";
import OrganisationCard from "@/app/components/Cards/OrganisationCard";
import Link from "next/link";

export default function GetLastOrganisations(){
    const [organisations, setOrganisations] = useState([]);
    useEffect(() => {
        const fetchOrganisations = async () => {
            try {
                const response = await axios.get("/api/organisations/getLastOrganisations", {
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
                setOrganisations(response.data);
            } catch (err) {
                console.log(err);
            }
        }
        fetchOrganisations()
    }, []);

    return(
        <div className={"mt-10 p-8"}>
            <h3 className={"text-3xl text-center"}>Dernières organisations inscrites</h3>
            {organisations.length === 0 && (
                <p>Aucune organisation pour l'instant</p>
            )}
            <div className={"md:flex md:flex-wrap md:justify-center md:gap-4  grid justify-center"}>
                {organisations.map((organisation: object ) => <OrganisationCard organisation={organisation} key={organisation.id} overflow={false}/>)}
            </div>
            <span className={"flex justify-center"}>
                <Link href={"/organisations"} className={"mt-10 text-center bg-slate-800 text-white px-4 py-2"}>Voir plus</Link>
            </span>
        </div>
    )
}