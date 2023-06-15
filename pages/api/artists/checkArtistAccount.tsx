import {NextApiRequest, NextApiResponse} from "next";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import prisma from "@/prisma/client";
export const dynamic = 'force-dynamic'
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
){
    try {
        const session = await getServerSession(req, res, authOptions);
        const user = await prisma.user.findFirst({
            where: {
                email: session?.user?.email
            }
        })
        const artist = await prisma.artist.findFirst({
            where: {
                userId: user?.id
            }
        })
        if(artist){
            const result = true
            res.status(200).json(result)
        }
    }
    catch (error) {
        console.log(error)
    }
}