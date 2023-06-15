import {NextApiRequest, NextApiResponse} from "next";
import prisma from "@/prisma/client";
export const dynamic = 'force-dynamic'
export default async function handler(    req:NextApiRequest,
                                    res:NextApiResponse){
    try {
        const data =await prisma.artist.findMany({
            orderBy: { createdAt: "desc" },
            take:4
        })
        return res.status(200).json(data)
    }
    catch (error){
        return res.status(500).json(error)
    }
}