import type {NextApiRequest, NextApiResponse} from "next";
import prisma from "@/prisma/client";

export default async function handler(
    req:NextApiRequest,
    res:NextApiResponse
){

    try {
        const artist = req.body.params.artist
        const session = req.body.params.session
        const prismaUser = await prisma.user.findUnique({
            where: {email: session?.user?.email || undefined},
        })
        const userId = prismaUser?.id
        //récupération des likes
        const like = await prisma.likes.findFirst({
            where: {
                artistId: artist.id,
                userId: prismaUser.id
            },
        });

        if (like) {
            // L'utilisateur a déjà aimé l'artiste, supprimer le like
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
                    artist: { connect: { id: artist.id } },
                    type: "artist"
                }
            });
            console.log(newLike);
        }



        return res.status(200).end()
    }
    catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
}
}