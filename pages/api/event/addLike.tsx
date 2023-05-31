import type {NextApiRequest, NextApiResponse} from "next";
import prisma from "@/prisma/client";

export default async function handler(
    req:NextApiRequest,
    res:NextApiResponse
){

    try {
        const eventId = req.body.eventId as string
        const session = req.body.session as {
            user: {
                name: string;
                email: string;
                image: string;
            };
            expires: string;
        };

        const prismaUser = await prisma.user.findUnique({
            where: {email: session?.user?.email || undefined},
        })
        const userId = prismaUser?.id
        //récupération des likes
        const like = await prisma.likes.findFirst({
            where: {
                eventId: eventId,
                userId: prismaUser?.id
            },
        });

        if (like) {
            // L'utilisateur a déjà aimé l'event, supprimer le like
            const deleteLike = await prisma.likes.delete({
                where: {
                    id: like.id
                }
            });
            console.log(deleteLike);
        } else {
            // L'utilisateur n'a pas aimé l'artiste, créer un nouveau like
            const newLike = await prisma.likes.create({
                data: {
                    User: { connect: { id: userId } },
                    event: { connect: { id: eventId } },
                    type: "event"
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