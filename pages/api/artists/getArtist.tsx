import type {NextApiRequest, NextApiResponse} from "next";
import prisma from "@/prisma/client";

export default async function handler(
    req:NextApiRequest,
    res:NextApiResponse
){
    try {
        const {artistName} = req.query
        //get artist with spaces in artistName
        const artist = await prisma.$queryRaw`
      SELECT * FROM "Artist"
      WHERE LOWER(REPLACE("artistName", ' ', '')) = LOWER(REPLACE(${artistName}, ' ', ''))
    `;
        if (!artist) {
            return res.status(404).json("Artiste non trouvé");
        }
        return res.status(200).json(artist)
    }catch (error){
        return res.status(500).json(error)
    }
}