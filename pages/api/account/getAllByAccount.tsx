import type {NextApiRequest, NextApiResponse} from "next";
import prisma from "@/prisma/client";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";

export default async function handler(
    req:NextApiRequest,
    res:NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions);
    const user = await prisma.user.findUnique({
        where: { email: session?.user?.email || undefined },
    })
    return res.status(200).json(user)
}