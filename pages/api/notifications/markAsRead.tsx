import {NextApiRequest, NextApiResponse} from "next";
import prisma from "@/prisma/client";

export default async function handler(req: NextApiRequest,
                                      res: NextApiResponse){
    console.log(req.query)
        try {
            const notificationUpdate = await prisma.notification.update({
                where: {
                    id: req.query.notificationId
                },
                data: {
                    read: true
                }
            })
        }catch (error){
        res.status(500).json({error: "Something went wrong"})
        }
}