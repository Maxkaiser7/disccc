import type {NextApiRequest, NextApiResponse} from "next";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import prisma from "@/prisma/client";
export const dynamic = 'force-dynamic'
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {

        const session = await getServerSession(req, res, authOptions)
        if (!session) return res.status(401).json({message: "Connectez vous pour pouvoir poster"});
        const title: string = req.body.title

        //get user
        const prismaUser:any = await prisma.user.findUnique({
            where: {email: session?.user?.email || undefined}
        })
        //check title
        if (title.length > 300) return res.status(403).json({message: "Votre message est trop long"})
        if (!title.length) return res.status(403).json({message: "Veuillez remplir le champ"})

        //create post
        try {
            const result = await prisma.post.create({
                data: {
                    postContent: title,
                    userId: prismaUser.id
                }
            })
            res.status(200).json(result)
        } catch (error) {
            res.status(403).json({error: "Il y a eu une error lors de la publication"})
        }
    }
}