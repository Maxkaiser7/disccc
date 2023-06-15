import Link from "next/link";
import Login from "@/app/auth/Login";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import Logged from "@/app/auth/Logged";
import {useState, useEffect} from "react";
import {useSession} from "next-auth/react";
import BurgerMenu from "@/app/components/BurgerMenu";
import {useRouter} from "next/router";
import prisma from "@/prisma/client";
import SearchBarNav from "@/app/components/SearchBarNav";
import Notification from "@/app/components/Notification";
/*export async function getServerSideProps(context) {
    const session = await getServerSession(authOptions, context);
    let user = null;

    if (session?.user?.email) {
        user = await prisma.user.findUnique({
            where: {
                email: session.user.email,
            },
        });
    }

    return {
        props: {
            user,
        },
    };
}*/
export default async function  Nav(){
    const session = await getServerSession(authOptions);
    let user : any =""
    if (session){
        user = await prisma.user.findUnique({
            where: {
                // @ts-ignore
                email: session?.user?.email,
            },
        })
    }
    return(
        <nav className={"flex justify-between items-center py-8 px-4"}>
            <Link href={"/"}>
                <h1 className={"font-bold text-lg"}>DISCCC</h1>
            </Link>
            {session?.user && <Notification/>}
            <BurgerMenu propsSession={session ?? undefined} propsUser={user ?? undefined}/>
        </nav>
    )
}