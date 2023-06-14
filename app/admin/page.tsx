import {getServerSession} from "next-auth";
import prisma from "@/prisma/client";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import Link from "next/link";

export default async function adminPage(){
    const session = await getServerSession(authOptions);
    const user = await prisma.user.findUnique({
        where: {
            email: session?.user?.email,
        },
    })
    if (user.role !== "ADMIN") {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }
    return(
        <div>
        </div>
    )
}