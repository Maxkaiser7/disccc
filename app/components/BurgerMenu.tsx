"use client"
import Link from "next/link";
import {useState} from "react";
import {mockSession} from "next-auth/client/__tests__/helpers/mocks";
import Login from "@/app/auth/Login";
import Logged from "@/app/auth/Logged";

import {useRouter} from "next/router";
import Notification from "@/app/components/Notification";

interface BurgerMenuProps {
    propsSession?: any;
    propsUser?: any;
}

export default function BurgerMenu({propsSession, propsUser}: BurgerMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => setIsOpen(!isOpen)
    let username = ""; // Définir une valeur par défaut pour la variable username
    const ulClassName = isOpen ? "flex flex-col absolute bg-black py-6 px-[3rem] mr-0 font-light text-2xl right-0 gap-4 z-10" : "hidden lg:flex flex-col absolute bg-black py-6 px-[3rem] mr-0 font-light text-2xl right-0 gap-4 z-10 lg:flex-row lg:bg-transparent lg:top-2 lg:right-12 lg:text-sm lg:items-center";

    /* const session = props.propsSession
     const user = props.propsUser

     */
    const session = propsSession
    if (session) {
        const usernameSession = session.user.name.toLowerCase()
        username = usernameSession.replace(/\s+/g, "")
    }
    console.log(session)
    return (
        <div className={"flex"}>
            <button className="w-10 h-10 relative -top-2.5 left-4 focus:outline-none flex-end z-20 lg:hidden"
                    onClick={toggleMenu}>
                <div className="block w-5 space-y-1.5 absolute  transform ">
                    <span aria-hidden="true"
                          className={`block w-full h-0.5 rounded-full bg-white transform transition duration-500 ease-in-out ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                    <span aria-hidden="true"
                          className={`block w-full h-0.5 rounded-full bg-white transform transition duration-500 ease-in-out ${isOpen ? 'opacity-0' : ''}`}></span>
                    <span aria-hidden="true"
                          className={`block w-full h-0.5 rounded-full bg-white transform transition duration-500 ease-in-out ${isOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
                </div>
            </button>
                <ul className={ulClassName}>
                    <Link href={"/"}><li key={"accueil"}>Accueil</li></Link>
                    {session &&
                        <Link href={`/profil/${username}`}><li key={"profil"}>Profil</li></Link>
                    }
                    <Link href={"/artists"}><li key={"artist"}>Artistes</li></Link>
                    <Link href={"/events"}><li key={"events"}>Evenements</li></Link>
                    <Link href={"/organisations"}><li key={"organisations"}>Organisations</li></Link>
                    <Link href={"/genres"}><li key={"genres"}>Genres</li></Link>
                    <Link href={"/contact"}><li key={"contacts"}>Contact</li></Link>
                    {!session?.user && <Login/>}
                    {session?.user && <Logged username={username} image={session.user?.image || ""}/>}
                    <li key={"admin"}>
                        {propsUser?.role === "ADMIN" && (
                            <Link href={"/admin"}>Admin</Link>)
                        }
                    </li>
                </ul>
        </div>
    )
}