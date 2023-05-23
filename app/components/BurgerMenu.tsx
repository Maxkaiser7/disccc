"use client"
import Link from "next/link";
import {useState} from "react";
import {mockSession} from "next-auth/client/__tests__/helpers/mocks";
import user = mockSession.user;
import Login from "@/app/auth/Login";
import Logged from "@/app/auth/Logged";
import {useRouter} from "next/router";

export default function BurgerMenu(props: object) {
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => setIsOpen(!isOpen)
    let username = ""; // Définir une valeur par défaut pour la variable username

    const session = props.propsSession
    if (session){
        const usernameSession = session.user.name.toLowerCase()
        username = usernameSession.replace(/\s+/g, "")
    }


    return (
        <div className={"flex"}>
            <button className="w-10 h-10 relative -top-2.5 left-4 focus:outline-none flex-end z-20"
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
            {isOpen &&
                <ul className={"flex flex-col absolute bg-black py-6 px-[3rem] mr-0 font-light text-2xl right-0 gap-4 z-10"}>
                    <li ><Link href={"/"} onClick={toggleMenu}>Accueil</Link></li>
                    {session &&
                        <li><Link href={`/profil/${username}`} onClick={toggleMenu}>Profil</Link></li>
                    }

                    <li><Link href={"/artists"} onClick={toggleMenu}>Artistes</Link></li>
                    <li><Link href={"/events"} onClick={toggleMenu}>Evenements</Link></li>
                    <li><Link href={"/genres"} onClick={toggleMenu}>Genres</Link></li>
                    <li><Link href={"/"} onClick={toggleMenu}>Contact</Link></li>
                    <li>
                        {!session?.user && <Login/>}
                        {session?.user && <Logged image={session.user?.image || ""}/>}
                    </li>

                </ul>}
        </div>
    )
}