import {NextApiRequest, NextApiResponse} from "next";
import prisma from "@/prisma/client";
export const dynamic = 'force-dynamic'
export default async function handler(    req: NextApiRequest,
                                    res: NextApiResponse){
    try{
        const { artistId } = req.body.params; // Récupérer l'ID de l'artiste depuis les paramètres d'URL
        const artist = await prisma.artist.delete({
            where: {
                id: artistId
            }
        })
        res.status(200).json({message: "ok"})
    } catch (e) {
        console.log(e)
    }
}