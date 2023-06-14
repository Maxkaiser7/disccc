import {NextApiRequest, NextApiResponse} from "next";
import prisma from "@/prisma/client";

export default async function (Req:NextApiRequest, res:NextApiResponse) {
    try {
        const data =await prisma.organisation.findMany({
            orderBy: { createdAt: "desc" },
            take:4
        })
        return res.status(200).json(data)
    }catch (error){
        return res.status(500).json(error)
    }
}