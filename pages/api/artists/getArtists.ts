import type {NextApiRequest, NextApiResponse} from "next";
import prisma from "@/prisma/client";
import {Property} from "csstype";
import Columns = Property.Columns;

export default async function handler(
    req:NextApiRequest,
    res:NextApiResponse
){

    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const data = await prisma.artist.findMany({
            orderBy: { createdAt: "desc" },
            take: limit + 1, // Demander un élément supplémentaire pour vérifier s'il y a une page suivante
            skip: skip,
        });

        const hasMore = data.length > limit;
        const artists = hasMore ? data.slice(0, limit) : data;


        return res.status(200).json(data)
    }catch (error){
        return res.status(500).json(error)
    }
}