import type {NextApiRequest, NextApiResponse} from "next";
import prisma from "@/prisma/client";
import {getSession} from "next-auth/react";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import bodyParser from "body-parser";
export const config = {
    api: {
    },
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const session = await getServerSession(req, res, authOptions)
    const userMail : string | null | undefined = session?.user?.email
    const artist = await prisma.artist.findFirst({
        where: {
            userId: session?.user?.id
        },
    })
    if (!userMail) {
        res.status(200).json(false);
        return;
    }
    if (req.method === "POST") {
        try {
            const user = await prisma.user.findFirst({
                where: {
                    email : userMail
                }

            })
            const artistName = req.body.artistName;

            console.log(artistName)
            const updateArtist : Artist | null = await prisma.artist.update({
                where: {
                    id: artist?.id
                },
                data: {
                    artistName:artistName
                }
            });
            return res.status(200).json(updateArtist)
        } catch (error) {
            return res.status(500).json(error)
        }
    }
}