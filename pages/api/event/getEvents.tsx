import prisma from "@/prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
export const dynamic = 'force-dynamic'
export default async function getEvents(req: NextApiRequest, res: NextApiResponse) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    try {
        const data = await prisma.event.findMany({
            orderBy: {
                createdAt: "desc",
            },
            take: limit + 1,
            skip: skip,
        });

        const hasMore = data.length > limit;
        const events = hasMore ? data.slice(0, limit) : data;

        return res.status(200).json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Une erreur s'est produite lors de la récupération des événements." });
    }
}
