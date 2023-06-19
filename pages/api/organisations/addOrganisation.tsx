import {NextApiRequest, NextApiResponse} from "next";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import formidable from "formidable";
import prisma from "@/prisma/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const data = req.body.params

        const session = await getServerSession(req, res, authOptions);
        if (!session)
            return res.status(401).json({message: "Connectez vous pour pouvoir poster"})
        const user : any = await prisma.user.findFirst({
            where: {
                email: session?.user?.email
            }
        })
        const organisation : any = await prisma.organisation.create({
            // @ts-ignore
            data: {
                organisationName: data.organisationName,
                userId: user?.id,
                description: data.description,
                ...(data.imageSrc.startsWith("http") && { image: data.imageSrc }),
            }
        })
        return res.status(200).json({message: "organisation ajouté avec succès"})
    } catch (error) {
        console.log(error)
    }
}