"use client"
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminUser() {
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("/api/users/getUsers", {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                setUsers(response.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchUsers();
    }, []);

    const deleteUser = async (userId: string) => {
        try {
            await axios.post(`/api/users/deleteUser/`, {
                params: { userId },
            });
            setUsers((prevUsers: any[]) => prevUsers.filter((user) => user.id !== userId));
        } catch (err) {
            console.log(err);
        }
    };

    const changeUserRole = async (userId: string, newRole: string) => {
        try {
            await axios.post(`/api/users/changeRole/`, {
                params: { userId, role: newRole },
            });
            setUsers((prevUsers: any[]) =>
                prevUsers.map((user) => {
                    if (user.id === userId) {
                        return { ...user, role: newRole };
                    }
                    return user;
                })
            );
        } catch (err) {
            console.log(err);
        }
    };

    const [hoveredUserId, setHoveredUserId] = useState<string | null>(null);

    const handleMouseEnter = (userId: string) => {
        setHoveredUserId(userId);
    };

    const handleMouseLeave = () => {
        setHoveredUserId(null);
    };

    return (
        <div className="overflow-x-auto">
            <table className="table-auto border-collapse border-white border">
                <thead>
                <tr>
                    <th className="px-4 py-2">id</th>
                    <th className="px-4 py-2">name</th>
                    <th className="px-4 py-2">email</th>
                    <th className="px-4 py-2">emailVerified</th>
                    <th className="px-4 py-2">image</th>
                    <th className="px-4 py-2">accounts</th>
                    <th className="px-4 py-2">sessions</th>
                    <th className="px-4 py-2">Post</th>
                    <th className="px-4 py-2">Event</th>
                    <th className="px-4 py-2">Comments</th>
                    <th className="px-4 py-2">Artist</th>
                    <th className="px-4 py-2">likes</th>
                    <th className="px-4 py-2">Organisation</th>
                    <th className="px-4 py-2">role</th>
                    <th className="px-4 py-2">Notification</th>
                    <th className="px-4 py-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td className="border px-4 py-2">{user.id}</td>
                        <td className="border px-4 py-2">{user.name}</td>
                        <td className="border px-4 py-2">{user.email}</td>
                        <td className="border px-4 py-2">{user.emailVerified}</td>
                        <td className="border px-4 py-2">{user.image}</td>
                        <td className="border px-4 py-2">{user.accounts}</td>
                        <td className="border px-4 py-2">{user.sessions}</td>
                        <td className="border px-4 py-2">{user.Post}</td>
                        <td className="border px-4 py-2">{user.Event}</td>
                        <td className="border px-4 py-2">{user.Comments}</td>
                        <td className="border px-4 py-2">{user.Artist}</td>
                        <td className="border px-4 py-2">{user.likes}</td>
                        <td className="border px-4 py-2">{user.Organisation}</td>
                        <td className="border px-4 py-2">{user.role}</td>
                        <td className="border px-4 py-2">{user.Notification}</td>
                        <td className="border px-4 py-2 flex">
                            <button
                                onClick={() => deleteUser(user.id)}
                                className="text-red-500 hover:text-red-700"
                            >
                                &#10006;
                            </button>
                            <div className="relative">
                                <button
                                    onClick={() => {
                                        const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
                                        changeUserRole(user.id, newRole);
                                    }}
                                    className="text-white hover:text-slate-300 ml-2"
                                >
                                    Changer de rôle
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
