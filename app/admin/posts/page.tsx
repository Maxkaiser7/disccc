"use client"
import prisma from "@/prisma/client";
import {useEffect, useState} from "react";
import axios from "axios";
import {BsFillTrashFill} from "react-icons/bs";

export default function adminPost() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get("/api/posts/getPosts", {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                setPosts(response.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchPosts();
    }, []);

    const deletePost = async (postId: string) => {
        try {
            await axios.post(`/api/posts/deletePost/`, {
                params: {postId},
            });
            setPosts((prevPosts) => prevPosts.filter((post : any) => post.id !== postId));
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="overflow-x-auto flex justify-center mt-4">
            <table className="table-auto border-collapse border-white border text-xs font-light ">
                <thead>
                <tr className={"bg-slate-700 "}>
                    <th className="px-4 py-2 whitespace-nowrap">Actions</th>
                    <th className="px-4 py-2 whitespace-nowrap">createdAt</th>
                    <th className="px-4 py-2 whitespace-nowrap">postContent</th>
                    <th className="px-4 py-2 whitespace-nowrap">published</th>
                    <th className="px-4 py-2 whitespace-nowrap">Artist</th>
                    <th className="px-4 py-2 whitespace-nowrap">Organisation</th>
                    <th className="px-4 py-2 whitespace-nowrap">Event</th>
                </tr>
                </thead>
                <tbody>
                {posts.map((post: any) => (
                    <tr key={post.id}>
                        <button
                            onClick={() => deletePost(post.id)}
                        >
                            <BsFillTrashFill/>
                        </button>
                        <td className="border px-4 py-2 whitespace-nowrap">{post.createdAt}</td>
                        <td className="border px-4 py-2 whitespace-nowrap">{post.postContent}</td>
                        <td className="border px-4 py-2 whitespace-nowrap">{post.published}</td>
                        <td className="border px-4 py-2 whitespace-nowrap">{post.Artist}</td>
                        <td className="border px-4 py-2 whitespace-nowrap">{post.Organisation}</td>
                        <td className="border px-4 py-2 whitespace-nowrap">{post.Event}</td>
                        <td className="border px-4 py-2 whitespace-nowrap">

                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
