import {NextApiRequest, NextApiResponse} from "next";
import prisma from "@/prisma/client";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
        try {
            const {artist, session, postContent } = req.body;
            const user = await prisma.user.findFirst({
                where: {
                    email: session?.user?.email
                }
            })
            // Rechercher le plus récent post publié de l'utilisateur
            const oldestPublishedPost = await prisma.post.findFirst({
                where: {
                    userId: user?.id,
                    published: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });

            // Mettre à jour l'ancien post publié s'il existe
            if (oldestPublishedPost) {
                await prisma.post.update({
                    where: {
                        id: oldestPublishedPost.id,
                    },
                    data: {
                        published: false,
                    },
                });
            }
            const newPost = await prisma.post.create({
                data: {
                    userId: user?.id,
                    postContent: postContent,
                    artistId: artist?.id,
                    published: true

                }
            })
            return res.status(200).json(newPost)
        }catch (error) {
            console.log(error)
        }
}