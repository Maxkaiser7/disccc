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
        <>
            <form className={"absolute right-16 text-xl flex items-center"}
                  onSubmit={handleSubmit}>
                {isOpen && <button onClick={() => setIsOpen(!isOpen)} className={"mr-2"}>
                    <AiOutlineSearch/>
                </button>}
                {!isOpen && <div className={"flex items-center"}>
                    <input type={"text"}
                           value={search}
                           onChange={(e) => {
                               setSearch(e.target.value)
                           }}
                           className={` h-[1.8rem] w-[9rem] rounded ${isOpen ? "scale-0" : "scale-100"}`}/>
                    <button type={"submit"} className={"absolute right-2"}>
                        <span className="sr-only">Search</span>
                        <AiOutlineSearch className="text-gray-400" />
                    </button>
                </div>}

            </form>
        </>
    )
}