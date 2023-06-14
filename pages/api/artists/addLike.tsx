import type {NextApiRequest, NextApiResponse} from "next";
import prisma from "@/prisma/client";

export default async function handler(
    req:NextApiRequest,
    res:NextApiResponse
){

    try {
        const artistId :string = req.body.params.artistId
        const userId : string = req.body.params.userId
        const prismaUser = await prisma.user.findUnique({
           where: {
               id: userId
           }
        })
        //récupération des likes
        const like = await prisma.likes.findFirst({
            where: {
                artistId: artistId,
                userId: userId
            },
        });

        if (like) {
            // L'utilisateur a déjà aimé l'artiste, supprimer le like
            const deleteLike = await prisma.likes.delete({
                where: {
                    id: like.id
                }
            });

        } else {
            // L'utilisateur n'a pas aimé l'artiste, créer un nouveau like
            const newLike = await prisma.likes.create({
                data: {
                    User: { connect: { id: userId } },
                    artist: { connect: { id: artistId } },
                    type: "artist"
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