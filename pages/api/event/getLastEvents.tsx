import type {NextApiRequest, NextApiResponse} from "next";
import prisma from "@/prisma/client";

export default async function handler(
    req:NextApiRequest,
    res:NextApiResponse
){
    try {
        //get prisma to fetch the posts
        const currentDate = new Date();

        const data = await prisma.event.findMany({
            orderBy: { createdAt: 'desc' },
            take: 4,
            where: {
                dateTo: {
                    gte: currentDate,
                },
            }
        })
        return res.status(200).json(data)
    }catch (error){
        return res.status(500).json(error)
    }
}