import {NextApiRequest, NextApiResponse} from "next";
import prisma from "@/prisma/client";
export const dynamic = 'force-dynamic'
export default async function handler(    req: NextApiRequest,
                                          res: NextApiResponse){
    try{
        const { eventId } = req.body.params; // Récupérer l'ID de l'event depuis les paramètres d'URL
        const event = await prisma.event.delete({
            where: {
                id: eventId
            }
        })
        res.status(200).json({message: "ok"})
    } catch (e) {
        console.log(e)
    }
}