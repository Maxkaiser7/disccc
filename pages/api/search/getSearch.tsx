import prisma from "@/prisma/client";
import {NextApiRequest, NextApiResponse} from "next";
import {useRouter} from "next/router";
import {redirect} from "next/navigation";
import {json} from "stream/consumers";

export const dynamic = 'force-dynamic'
export default async function handler(req: NextApiRequest,
                                      res: NextApiResponse) {


    if (req.method === "GET") {
        try {
            const {search: search} = req.query
            if (typeof search !== "string") {
                throw new Error("Recherche invalide")
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
                        {
                            address: {
                                equals:{
                                    commune: search
                                }
                            }
                        }

                    ]
                }
            });
            const artists = await prisma.artist.findMany({
                where: {
                    OR: [
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
                    OR: [
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
                where: {
                    nom: {
                        contains: search,
                        mode: "insensitive"
                    }
                }
            });
            const genreArtist = await prisma.genres.findMany({
                where: {
                    // @ts-ignore

                    id : artists[0].genresId
                }
            })
            const genreEvent = await prisma.genres.findMany({
                where: {
                    // @ts-ignore

                    id : events[0].genresId
                }
            })
            const relativeArtists = await prisma.artist.findMany({
                where: {
                    genresId: genreArtist[0].id
                }
            })

            const relativeEvents = await prisma.event.findMany({
                where: {
                   OR: [
                       {
                           genresId: genreEvent[0].id
                       },
                       {
                           genresId: genreArtist[0].id
                       }
                   ]
                }
            })



            const results = {
                events,
                artists,
                organisations,
                genres,
                relativeArtists,
                relativeEvents
            };

            res.status(200).json({message: "success", data: results});

        } catch (error) {
            res.status(500).end();
        }
    }
}
