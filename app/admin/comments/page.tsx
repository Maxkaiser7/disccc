"use client"
import { useEffect, useState } from "react";
import axios from "axios";

export default function Admincomment() {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get("/api/comments/getComments", {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                setComments(response.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchComments();
    }, []);

    const deleteComment = async (commentId: string) => {
        try {
            await axios.post(`/api/comments/deleteComment/`, {
                params: { commentId },
            });
            setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
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
                    <th className="px-4 py-2">type</th>
                    <th className="px-4 py-2">user</th>
                    <th className="px-4 py-2">event</th>
                    <th className="px-4 py-2">song</th>
                    <th className="px-4 py-2">likes</th>
                    <th className="px-4 py-2">userId</th>
                    <th className="px-4 py-2">eventId</th>
                    <th className="px-4 py-2">songsId</th>
                    <th className="px-4 py-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                {comments.map((comment) => (
                    <tr key={comment.id}>
                        <td className="border px-4 py-2">{comment.id}</td>
                        <td className="border px-4 py-2">{comment.createdAt}</td>
                        <td className="border px-4 py-2">{comment.type}</td>
                        <td className="border px-4 py-2">{comment.user}</td>
                        <td className="border px-4 py-2">{comment.event}</td>
                        <td className="border px-4 py-2">{comment.song}</td>
                        <td className="border px-4 py-2">{comment.likes}</td>
                        <td className="border px-4 py-2">{comment.userId}</td>
                        <td className="border px-4 py-2">{comment.eventId}</td>
                        <td className="border px-4 py-2">{comment.songsId}</td>
                        <td className="border px-4 py-2">
                            <button
                                onClick={() => deleteComment(comment.id)}
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
