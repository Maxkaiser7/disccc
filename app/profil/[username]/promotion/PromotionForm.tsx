"use client"
import React, {useState} from "react";
import Link from "next/link";
import {loadStripe} from '@stripe/stripe-js';
import {useRouter} from "next/router";
import {log} from "util";

interface PromotionFormProps {
    data: {
        events: Event[];
        artists: Artist[];
        organisations: Organisation[];
    };
}

interface Event {
    // Définissez les propriétés de l'objet Event ici
    name: string;
}

interface Artist {
    // Définissez les propriétés de l'objet Artist ici
    artistName: string;
}

interface Organisation {
    // Définissez les propriétés de l'objet Organisation ici
    organisationName: string;
}


export default function PromotionForm(props: PromotionFormProps) {
    const {data} = props;
    const [selected, setSelected] = useState<string>("");

    const handleSelection = (item: Event | Artist | Organisation) => {
        setSelected(item);

    };

    return (
        <div>

            <h1 className={"text-3xl"}>Promotion</h1>
            <form action="/api/checkout_sessions" method="POST" className={"flex flex-col mb-3"}>
                <select
                    name="eventId"
                    onChange={(e) => setSelected(e.target.value)}
                    className={"px-4 py-2"}
                >
                    <option value="">Choisissez un evenement</option>
                    {data.events.map((event) => (
                        <option key={event.id} value={event.id}>
                            {event.name}
                        </option>
                    ))}
                </select>
                <button className={"px-4 py-2 bg-slate-700 hover:bg-slate-500"} type="submit" role="link">
                    Valider
                </button>
            </form>
            {data.artists && (
                <form action="/api/checkout_sessions" method="POST" className={"flex flex-col mb-3"}>
                    <button className={"px-4 py-2 bg-slate-700 hover:bg-slate-500"} name={"artistName"} type="submit" role="link" value={data.artists[0].artistName}>
                        Promouvoir mon profil artiste
                    </button>
                </form>
            )}
            {data.organisations && (
                <form action="/api/checkout_sessions" method="POST" className={"flex flex-col"}>
                    <button className={"px-4 py-2 bg-slate-700 hover:bg-slate-500"} name={"organisationName"} type="submit" role="link" value={data.organisations[0].organisationName}>
                        Promouvoir mon organisation
                    </button>
                </form>
            )}

        </div>
    );
}
