import prisma from "@/prisma/client";
import {NextApiRequest, NextApiResponse} from "next";
import {useRouter} from "next/router";
import {redirect} from "next/navigation";

export default async function handler(req: NextApiRequest,
                                      res: NextApiResponse) {


    if (req.method === "GET") {
        try {
            const {search : search} = req.query
            if (typeof search !== "string") {
                throw new Error("Invalid search query")
            }
            const events = await prisma.event.findMany({
                where: {
                    OR: [
                        {
                            name: {
                                contains: search,
                                mode: "insensitive"
                            }
                        },
                        {
                            description: {
                                contains: search,
                                mode: "insensitive"
                            }
                        },

                    ]
                }
            });
            const artists = await prisma.artist.findMany({
                where: {
                    OR : [
                        {
                            artistName: {
                                contains: search,
                                mode: "insensitive"
                            }
                        },

                    ]
                }
            });
            const organisations = await prisma.organisation.findMany({
                where: {
                    OR : [
                        {
                            organisationName: {
                                contains: search,
                                mode: "insensitive"
                            }
                        },
                        {
                            description: {
                                contains: search,
                                mode: "insensitive"
                            }
                        }
                    ]
                }
            });
            const genres = await prisma.genres.findMany({
                where : {
                    nom:{
                        contains: search,
                        mode: "insensitive"
                    }
                }
            });
            const results = {
                events,
                artists,
                organisations,
                genres
            };
            res.status(200).json({message: "success", data: results});

        } catch (error) {
            res.status(500).end();
        }
    }
}
