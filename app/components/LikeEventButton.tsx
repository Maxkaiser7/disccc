"use client"
import {AiFillHeart, AiOutlineHeart, AiOutlineStar} from "react-icons/ai";
import {useEffect, useState} from "react";
import prisma from "@/prisma/client";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import axios from "axios";
import {getSession} from "next-auth/react";
export default function LikeEventButton(props: { eventId: string }, {session}: any) {
    const [isLiked, setIsLiked] = useState(false);
    const getLike = async () => {
        const session = await getSession()

        const like = await axios.post("/api/event/getLikes", {
            eventId: props.eventId,
            session: {
                user: {
                    name: session?.user?.name,
                    email: session?.user?.email,
                    image: session?.user?.image,
                },
                expires: session?.expires,
            },
        })
        setIsLiked(like.data)
    }
    useEffect(() => {
        getLike()
    }, []);

    const handleClick = async (e: any) => {
        setIsLiked(!isLiked)
        const session = await getSession()
        e.preventDefault()

        const addLike = await axios.post("/api/event/addLike", {
            eventId: props.eventId,
            session: {
                user: {
                    name: session?.user?.name,
                    email: session?.user?.email,
                    image: session?.user?.image,
                },
                expires: session?.expires,
            },
        })
    }
    return (
        <>
            <button className={"bg-slate-800 h-12 px-6 flex items-center gap-1"}
                    onClick={handleClick}>
                {isLiked ? <AiFillHeart/> : <AiOutlineHeart/>}
            Interessé
        </button>
        </>
    )
}