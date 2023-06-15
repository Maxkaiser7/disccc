import {NextApiRequest, NextApiResponse} from "next";
import prisma from "@/prisma/client";
export const dynamic = 'force-dynamic'
export default async function handler(
    req:NextApiRequest,
    res:NextApiResponse
){
    try {
        const { genreId } = req.body;
        const artists = await prisma.artist.findMany({
            where: {
                genresId: genreId
            },
        })
        const events = await prisma.event.findMany({
            where: {
                genresId: genreId,
            },
        })
        const data = {
            artists,
            events
        }
        res.status(200).json(data);

    }catch (error) {
        console.error(error);
        return res.status(500).json({error: "Internal server error"});
    }
}