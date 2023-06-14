import {NextApiRequest, NextApiResponse} from "next";
import prisma from "@/prisma/client";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const {organisationName} = req.query
        const currentDate = new Date();
        const organisation = await prisma.$queryRaw`
        SELECT * FROM "Organisation"
        WHERE LOWER(REPLACE("organisationName", ' ', '')) = LOWER(REPLACE(${organisationName}, ' ', ''))`
        const events = await prisma.event.findMany({
            where: {
                organisationId: organisation?.id,
                dateTo: {
                    gte: currentDate.toISOString()
                }
            }
        })

        const like = await prisma.likes.findFirst({
            where: {
                organisationId: organisation?.id
            }
        })
        const data = {
            events,
            like,
            organisation
        }
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json(error)
    }
}