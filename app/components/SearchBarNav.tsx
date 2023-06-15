"use client"
import {AiOutlineSearch} from "react-icons/ai";
import {RxCross1} from "react-icons/rx";
import {useState} from "react";
import {router} from "next/client";
import axios from "axios";
import {log} from "util";
import {useRouter} from "next/navigation";

export default function SearchBarNav() {
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const [search, setSearch] = useState<string>("");
    const router = useRouter();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        /*
        const formData = new FormData();
        formData.append("search", search);

        try {
            const response = await axios.post("/api/search/getSearch", formData, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
        } catch (error) {
            // Gérez les erreurs de la requête
        }*/
        const encodedQuery = encodeURIComponent(search);
        router.push("/search?search=" + encodedQuery);
    }
    return (
        <form
            className="text-xl flex items-center justify-center flex-wrap w-12/12"
            onSubmit={handleSubmit}
        >
            <div className="relative flex items-center mb-28 top-[17rem] lg:mb-16 lg:top-[14rem]">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="lg:w-[35rem] pl-10 pr-4 py-2 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    className="absolute right-2 top-1/2  transform -translate-y-1/2"
                >
                    <span className="sr-only">Search</span>
                    <AiOutlineSearch className="text-gray-400" />
                </button>
            </div>
        </form>
    )
}