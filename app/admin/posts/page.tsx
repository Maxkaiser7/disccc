"use client"
import prisma from "@/prisma/client";
import { useEffect, useState } from "react";
import axios from "axios";

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

    const deletePost = async (postId:string) => {
        try {
            await axios.post(`/api/posts/deletePost/`, {
                params: { postId },
            });
            setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="table-auto border-collapse border-white border">
                <thead>
                <tr>
                    <th className="px-4 py-2">id</th>
                    <th className="px-4 py-2">createdAt</th>
                    <th className="px-4 py-2">updatedAt</th>
                    <th className="px-4 py-2">postContent</th>
                    <th className="px-4 py-2">published</th>
                    <th className="px-4 py-2">userId</th>
                    <th className="px-4 py-2">user</th>
                    <th className="px-4 py-2">Artist</th>
                    <th className="px-4 py-2">artistId</th>
                    <th className="px-4 py-2">Organisation</th>
                    <th className="px-4 py-2">organisationId</th>
                    <th className="px-4 py-2">Event</th>
                    <th className="px-4 py-2">eventId</th>
                    <th className="px-4 py-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                {posts.map((post) => (
                    <tr key={post.id}>
                        <td className="border px-4 py-2">{post.id}</td>
                        <td className="border px-4 py-2">{post.createdAt}</td>
                        <td className="border px-4 py-2">{post.updatedAt}</td>
                        <td className="border px-4 py-2">{post.postContent}</td>
                        <td className="border px-4 py-2">{post.published}</td>
                        <td className="border px-4 py-2">{post.userId}</td>
                        <td className="border px-4 py-2">{post.user}</td>
                        <td className="border px-4 py-2">{post.Artist}</td>
                        <td className="border px-4 py-2">{post.artistId}</td>
                        <td className="border px-4 py-2">{post.Organisation}</td>
                        <td className="border px-4 py-2">{post.organisationId}</td>
                        <td className="border px-4 py-2">{post.Event}</td>
                        <td className="border px-4 py-2">{post.eventId}</td>
                        <td className="border px-4 py-2">
                            <button
                                onClick={() => deletePost(post.id)}
                                className="text-red-500 hover:text-red-700"
                            >
                                &#10006;
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
