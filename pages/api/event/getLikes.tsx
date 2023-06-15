import {NextApiRequest, NextApiResponse} from "next";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {getServerSession} from "next-auth";
import prisma from "@/prisma/client";
import {getSession} from "next-auth/react";
import {log} from "util";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
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
            where: {
                email: session?.user?.email
            }
        })
        const like = await prisma.likes.findFirst({
            where: {
                artistId: eventId,
                // @ts-ignore
                User: prismaUser
            }
        })
        if (like) {
            res.status(200).json({ success: true });
        } else {
            return res.status(200).json(false)
        }
    } catch (error) {
        return res.status(500).json(error)
    }
}