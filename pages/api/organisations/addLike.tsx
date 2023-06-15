import type {NextApiRequest, NextApiResponse} from "next";
import prisma from "@/prisma/client";

export default async function handler(
    req:NextApiRequest,
    res:NextApiResponse
){

    try {
        const organisation = req.body.params.organisation
        const session = req.body.params.session
        const prismaUser = await prisma.user.findUnique({
            where: {email: session?.user?.email || undefined},
        })
        const userId = prismaUser?.id
        //récupération des likes
        const like = await prisma.likes.findFirst({
            where: {
                organisationId: organisation.id,
                userId: prismaUser?.id
            },
        });

        if (like) {
            // L'utilisateur a déjà aimé l'organisatione, supprimer le like
            const deleteLike = await prisma.likes.delete({
                where: {
                    id: like.id
                }
            });
            console.log(deleteLike);
        } else {
            // L'utilisateur n'a pas aimé l'organisatione, créer un nouveau like
            const newLike = await prisma.likes.create({
                data: {
                    User: { connect: { id: userId } },
                    organisation: { connect: { id: organisation.id } },
                    type: "organisation"
                }
            });
        }



        return res.status(200).end()
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}