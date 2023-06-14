import Link from "next/link";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {FiMail} from "react-icons/fi";

export default async function Footer() {
    const session = await getServerSession(authOptions);
    return (<footer className={"flex justify-evenly mt-44 bg-black py-12"}>
        <div className={"grid"}>
            <Link href={"/"}>Accueil</Link>np
            {session && <Link href={"/profil"}>Profil</Link>}
            <Link href={"/artists"}>Artistes</Link>
            <Link href={"/events"}>Evènements</Link>
            <Link href={"/organisations"}>Organisations</Link>
            <Link href={"/genres"}>Genres</Link>
            <Link href={"/contact"}>Contact</Link>
            {session && <Link href={"/logout"}>Déconnexion</Link>}
        </div>
        <div>
            <h3>Contact</h3>
                <a href="mailto:maxkaiser950@gmail.com"  className={"flex items-center gap-1"}>{<FiMail/>}maxkaiser950@gmail.com</a>
            <Link href={"/"}>
                <h1 className={"font-bold text-lg mt-10"}>DISCCC</h1>
            </Link>
        </div>
    </footer>)
}