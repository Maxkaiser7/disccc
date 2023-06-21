import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import UpdateUserForm from "@/app/profil/[username]/update/UpdateUserForm";
import Link from "next/link";


export default async function UpdateProfilePage (){
    const session = await getServerSession( authOptions)
    return(
        <div>
            <UpdateUserForm name={session?.user?.name}/>
            <Link href={`/profil/${session?.user?.name}`} className={"grid justify-center p-8"}>Retour au profil</Link>
        </div>
    )
}