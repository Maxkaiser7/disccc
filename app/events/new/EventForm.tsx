"use client"
import React, {FormEvent, useState} from "react";
import axios from "axios";
import {useRouter} from "next/router";

export default function EventForm() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [price, setPrice] = useState(0);
    const [address, setAddress] = useState("");
    const [facebookLink, setFacebookLink] = useState("");
    const [image, setImage] = useState("");
    const [rue, setRue] = useState("");
    const [cp, setCp] = useState("");
    const [commune, setCommune] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("name", name);
        formData.append("description", description);
        formData.append("dateFrom", dateFrom);
        formData.append("dateTo", dateTo);
        formData.append("price", price);
        formData.append("rue", rue);
        formData.append("commune", commune);
        formData.append("cp", cp);
        formData.append("facebookLink", facebookLink);
        formData.append("image", image);

// envoyez la demande à l'API en utilisant FormData
        try {
            const response = await axios.post("/api/event/addEvent", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
        } catch (error) {
            console.error(error);
            // Handle error here
        } finally {
            setIsLoading(false)
        }

    };

    return (
        <form onSubmit={handleSubmit}
              className={"flex flex-col gap-2"}
              encType={"multipart/form-data"}>
            <label htmlFor="name">Nom de l'événement</label>
            <input name={"name"} value={name} onChange={(e) => setName(e.target.value)}/>
            <label htmlFor="description">Description</label>
            <input
                name={"description"}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <label htmlFor="dateFrom">Date de début</label>
            <input
                name={"dateFrom"}
                type={"date"}
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
            />
            <label htmlFor="dateTo">Date de fin</label>
            <input
                name={"dateTo"}
                type={"date"}
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
            />
            <label htmlFor="price">Prix</label>
            <input
                name={"price"}
                type={"number"}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
            />
            <div id={"adresse"}>
                <label htmlFor="rue">Rue</label>
                <input
                    name={"rue"}
                    type={"string"}
                    value={rue}
                    onChange={(e) => setRue(e.target.value)}
                />
                <label htmlFor="cp">Code postal</label>
                <input
                    name={"cp"}
                    type={"string"}
                    value={cp}
                    onChange={(e) => setCp(e.target.value)}
                />
                <label htmlFor="commune">Commune</label>
                <input
                    name={"commune"}
                    type={"string"}
                    value={commune}
                    onChange={(e) => setCommune(e.target.value)}
                />
            </div>
            <label htmlFor="facebookLink">Evenement Facebook</label>
            <input type="string"
                   name={"facebookLink"}
                   value={facebookLink}
                   onChange={(e) => setFacebookLink(e.target.value)}/>
            <label htmlFor="image">Ajoutez une photo pour l'évenement</label>
            <input
                type="file"
                name={"image"}
                onChange={({target}) => {
                    if (target.files) {
                        const file: File = target.files[0];
                        setImage(URL.createObjectURL(file));
                        setImage(file);
                    }
                }}
            />
            <input type="submit"/>
        </form>
    );
}
