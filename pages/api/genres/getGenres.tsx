import type {NextApiRequest, NextApiResponse} from "next";
import prisma from "@/prisma/client";

export default async function handler(
    req:NextApiRequest,
    res:NextApiResponse
){
    try {
        //get artist with spaces in artistName
        const genre = await prisma.genres.findMany()

        return res.status(200).json(genre)
    }catch (error){
        return res.status(500).json(error)
    }
}