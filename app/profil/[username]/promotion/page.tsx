import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import prisma from "@/prisma/client";
import PromotionForm from "@/app/profil/[username]/promotion/PromotionForm";
export default async function PromotionPage(){
    const session = await getServerSession(authOptions);
    const user = await prisma.user.findUnique({
        where: { email: session?.user?.email || undefined },
    })
    const data = {
        events: await prisma.event.findMany({
            where: {
                userId: user?.id
            }
        }),
        artists: await prisma.artist.findMany({
            where: {
                userId: user?.id
            }
        }),
        organisations: await prisma.organisation.findMany({
            where: {
                userId: user?.id
            }
        })
    };
    return(
        <div>
            <PromotionForm data={data}/>
        </div>
    )
}