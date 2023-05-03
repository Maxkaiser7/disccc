import Link from "next/link";
import Login from "@/app/auth/Login";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import Logged from "@/app/auth/Logged";
export default async function  Nav(){
    const session = await getServerSession(authOptions)
    console.log(session)
    return(
        <nav className={"flex justify-between items-center py-8"}>
            <Link href={"/"}>
                <h1 className={"font-bold text-lg"}>DISCCC</h1>
            </Link>
            <ul className={"flex items-center gap-6"}>
                <Link href={"/signinartist"}>Devenir artist</Link>
                {!session?.user && <Login/>}
                {session?.user && <Logged image={session.user?.image || ""}/>}
            </ul>
        </nav>
    )
}