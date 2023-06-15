import {NextApiRequest, NextApiResponse} from "next";
import prisma from "@/prisma/client";

export default async function handler(
    req:NextApiRequest,
    res:NextApiResponse
){
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    try {
        const users = await prisma.user.findMany({

            take: limit + 1,
            skip: skip,
        })
        const hasMore = users.length > limit;
        const events = hasMore ? users.slice(0, limit) : users;
        return res.status(200).json(users)

    }
    catch (error){
        return res.status(500).json(error)
    }
}