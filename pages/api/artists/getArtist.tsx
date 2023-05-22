import type {NextApiRequest, NextApiResponse} from "next";
import prisma from "@/prisma/client";
import {Genres} from ".prisma/client";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const {artistName} = req.query
        //get artist with spaces in artistName
        const artist = await prisma.$queryRaw`
      SELECT * FROM "Artist"
      WHERE LOWER(REPLACE("artistName", ' ', '')) = LOWER(REPLACE(${artistName}, ' ', ''))
    `;
        if (!artist) {
            return res.status(404).json("Artiste non trouvé");
        }

        //récupération des genres de l'artiste
        const genre: Genres[] = await prisma.genres.findMany({where: {id: artist[0].genresId}});

        const artistsOnEvents = await prisma.artistsOnEvents.findMany({
            where: {
                artistId: artist[0].id,
            },
        })

        const events = await prisma.event.findMany({
            where: {
                id:{
                    in: artistsOnEvents.map(event => event.eventId)
                },
                dateTo:{
                    gte: new Date()
                }
            }
        })
        const data = {
            artist,
            genre,
            events
        }
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json(error)
    }
}