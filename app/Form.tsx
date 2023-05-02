"use client"
import React, {useState} from "react";
import {json} from "stream/consumers";

export default function FormPost() {
    const [title, setTitle] = useState("");

    async function submitPost(e: React.FormEvent) {
        e.preventDefault()
        const data = await fetch(`/api/createPost`, {
            method: "POST",
            body: JSON.stringify({title})
        })
        const res = await data.json()

        if(!res.ok) console.log(res)
    }

    return (
        <form onSubmit={submitPost}>
            <input type="text" onChange={(e) => setTitle(e.target.value)}
            value={title}/>
            <button type={"submit"}>Submit</button>
        </form>
    )
}