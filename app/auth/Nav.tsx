import Link from "next/link";
import Login from "@/app/auth/Login";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import Logged from "@/app/auth/Logged";
import {useState, useEffect} from "react";
import {useSession} from "next-auth/react";
import BurgerMenu from "@/app/components/BurgerMenu";
import {useRouter} from "next/router";
export async function getServerSideProps() {
    // Récupération des données du serveur ici
    return {
        props: {},
    };
}
export default async function  Nav(){
    const session = await getServerSession(authOptions)
    return(
        <nav className={"flex justify-between items-center py-8"}>
            <Link href={"/"}>
                <h1 className={"font-bold text-lg"}>DISCCC</h1>
            </Link>
            <BurgerMenu propsSession={session ?? undefined}/>
        </nav>
    )
}