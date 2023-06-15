import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/prisma/client";
export const dynamic = 'force-dynamic'
export default async function organisationsHandler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    try {
        const organisations = await prisma.organisation.findMany({
            orderBy: {
                createdAt: "desc",
            },
            take: limit + 1, // Demander un élément supplémentaire pour vérifier s'il y a une page suivante
            skip: skip,
        });

        const hasMore = organisations.length > limit;
        const organisationsData = hasMore
            ? organisations.slice(0, limit)
            : organisations;

        res.status(200).json(organisationsData);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Une erreur s'est produite lors de la récupération des organisations.",
        });
    }
}
