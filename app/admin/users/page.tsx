"use client"
import { useEffect, useState } from "react";
import axios from "axios";
import {BsFillTrashFill} from "react-icons/bs";

export default function AdminUser() {
    const [users, setUsers] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("/api/users/getUsers", {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    params: {
                        page: currentPage,
                        limit: itemsPerPage,
                    },
                });
                setUsers(response.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchUsers();
    }, [currentPage, itemsPerPage]);

    const deleteUser = async (userId: string) => {
        try {
            const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?");
            if(confirmed){
                await axios.post(`/api/users/deleteUser/`, {
                    params: { userId },
                });
                setUsers((prevUsers: any[]) => prevUsers.filter((user) => user.id !== userId));

            }
     } catch (err) {
            console.log(err);
        }
    };

    const changeUserRole = async (userId: string, newRole: string) => {
        try {
            const confirmed = window.confirm("Êtes-vous sûr de vouloir changer le rôle de cet utilisateur ?");
            if(confirmed){
                setUsers((prevUsers: any[]) =>
                    prevUsers.map((user) => {
                        if (user.id === userId) {
                            return { ...user, role: newRole };
                        }
                        return user;
                    })
                );
            }
            await axios.post(`/api/users/changeRole/`, {
                params: { userId, role: newRole },
            });

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
    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToNextPage = () => {
        setCurrentPage(currentPage + 1);
    };
    return (
        <div className="overflow-x-auto flex flex-col align-center mt-4">
            <table className="table-auto border-collapse border-white border text-xs font-light ">
                <thead>
                <tr className={"bg-slate-700 "}>
                    <th className="px-4 py-2 whitespace-nowrap">Actions</th>
                    <th className="px-4 py-2 whitespace-nowrap">name</th>
                    <th className="px-4 py-2 whitespace-nowrap">role</th>
                    <th className="px-4 py-2 whitespace-nowrap">email</th>
                    <th className="px-4 py-2 whitespace-nowrap">image</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td className="border px-4 py-2 whitespace-nowrap flex">
                            <button
                                onClick={() => deleteUser(user.id)}
                            >
                                <BsFillTrashFill/>
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
                        <td className="border px-4 py-2 whitespace-nowrap">{user.name}</td>
                        <td className="border px-4 py-2 whitespace-nowrap">{user.role}</td>
                        <td className="border px-4 py-2 whitespace-nowrap">{user.email ? user.email.slice(0,10) + "..." : "N/A"}</td>
                        <td className="border px-4 py-2 whitespace-nowrap">{user.image ? user.image.slice(0,10) + "..." : "N/A"}</td>

                    </tr>
                ))}
                </tbody>
            </table>
            <div className={"flex justify-center gap-2"}>
                <button onClick={goToPreviousPage} disabled={currentPage === 1}>
                    Précédent
                </button>
                <span>{currentPage}</span>
                <button onClick={goToNextPage}>Suivant</button>
            </div>
        </div>
    );
}
