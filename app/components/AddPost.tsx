'use client'
import React, {useState} from "react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import axios from "axios";

export default function CreatePost() {
    const [title, setTitle] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);

    //Create a post
    const {mutate} = useMutation(
        async (title: string) => await axios.post('/api/posts/addPost', {title}),
        {
            onError: (error) => {
                console.log(error)
            }, onSuccess: (data) => {
                console.log(data)
                setTitle('')
                setIsDisabled(false)
            }

        })
    const submitPost = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsDisabled(true)
        mutate(title)
    }
    return (
        <form onSubmit={submitPost}>
            <div className={"flex flex-col"}>
                <textarea name="title" value={title} onChange={(e) => setTitle(e.target.value)}
                          placeholder={"What's on your mind ?"}
                          className={"p-4 text-lg rounded-sm"}
                ></textarea>
            </div>
            <div className={'flex items-center justify-between gap-2'}>
                <p className={`font-bold text-sm ${title.length > 300 ? "text-red-700" : "text-gray-700"}`}>{`${title.length}/300`}</p>
                <button disabled={isDisabled}
                        className={"text-sm bg-teal-600 text-white px-4 py-2 mt-2 rounded-sm disabled:opacity-25"}
                        type={"submit"}>
                    Envoyer
                </button>
            </div>
        </form>
    )
}