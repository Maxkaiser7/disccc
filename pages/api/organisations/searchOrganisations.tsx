import type {NextApiRequest, NextApiResponse} from "next";
import prisma from "@/prisma/client";
export default async function handler(
    req:NextApiRequest,
    res:NextApiResponse
){
    try {
        //const search : string= req.body.artistName.toLowerCase()
        // @ts-ignore
        const search : string= req?.query?.organisationName?.toLowerCase()
        //get prisma to fetch the posts
        let data;
        if (search === "") {
            data = await prisma.organisation.findMany({
                orderBy: { createdAt: "desc" },
            });
        } else {
            data = await prisma.organisation.findMany({
                where: {
                    organisationName: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                orderBy: { createdAt: "desc" },
            });
        }
        if (data.length === 0) {
            return res.status(200).json("Nous n'avons trouvé aucun artiste");
        }
        return res.status(200).json(data)
    }catch (error){
        return res.status(500).json(error)
    }
}