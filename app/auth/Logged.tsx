'use client'

import Image from "next/image";
import {signOut} from "next-auth/react";
import Link from "next/link";
type User = {
    image: string,
    username: string
}
export default function Logged({image, username}: User){
    return(
        <li className={'flex gap-8 items-center'}>
            <button onClick={() => signOut()} className={'bg-gray-600 py-2 px-4 rounded-sm text-sm'}>Sign out</button>
            <Link href={`/profil/${username}`}>
                <Image width={64} height={64} className={"w-10 rounded-full"} src={image} alt={""}/>
        </Link>
        </li>
    )
}
