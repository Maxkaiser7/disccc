import type {NextApiRequest, NextApiResponse} from "next";
import prisma from "@/prisma/client";
export const dynamic = 'force-dynamic'
export default async function handler(
    req:NextApiRequest,
    res:NextApiResponse
){
    try {
    const {query} = req.body.params
        const data = await prisma.genres.create({
            data: {
                nom: query
            }
        })
        return res.status(200).json({message: "genre ajouté avec succès"})
    }catch (error){
        return res.status(500).json(error)
    }
}