import {NextApiRequest, NextApiResponse} from "next";
import prisma from "@/prisma/client";
export const dynamic = 'force-dynamic'
export default async function handler(req: NextApiRequest,
                                      res: NextApiResponse){
    console.log(req.query)
        try {
            const notificationUpdate = await prisma.notification.update({
                where: {
                    // @ts-ignore

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