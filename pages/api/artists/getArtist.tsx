import type {NextApiRequest, NextApiResponse} from "next";
import prisma from "@/prisma/client";
import {Genres} from ".prisma/client";
import {getSession} from "next-auth/react";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
export const dynamic = 'force-dynamic'
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const {artistName} = req.query
        //get artistes with spaces in artistName
        const artist : any = await prisma.$queryRaw`
      SELECT * FROM "Artist"
      WHERE LOWER(REPLACE("artistName", ' ', '')) = LOWER(REPLACE(${artistName}, ' ', ''))
    `;
        if (!artist) {
            return res.status(404).json("Artiste non trouvé");
        }
        /* const session = await getServerSession(req, res, authOptions);
         const prismaUser = await prisma.user.findUnique({
             where: {email: session?.user?.email || undefined},
         })*/
        //récupération des likes

        const like = await prisma.likes.findFirst({
            where: {
                artistId: artist[0].id,
            },
        });
        //récupération des genres de l'artiste
        let genre: any = []
        if (artist[0].genresId) {
            genre = await prisma.genres.findMany({where: {id: artist[0].genresId}});
        }


        const artistsOnEvents = await prisma.artistsOnEvents.findMany({
            where: {
                artistId: artist[0].id,
            },
        })

        let events: any = []
        if (artist[0].events) {
            events = await prisma.event.findMany({
                where: {
                    id: {
                        in: artistsOnEvents.map(event => event.eventId)
                    },
                    dateTo: {
                        gte: new Date()
                    }
                }
            })
        }
        const post = await prisma.post.findFirst({
            where: {
                artistId: artist[0].id,
                published: true
            },
        })


        const data = {
            artist,
            genre,
            events,
            like,
            post : post || null
        }
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json(error)
    }
}