import type {NextApiRequest, NextApiResponse} from "next";
import prisma from "@/prisma/client";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";

export default async function handler(
    req:NextApiRequest,
    res:NextApiResponse
){
    try {
        const session = await getServerSession(req, res, authOptions);
        const user = await prisma.user.findUnique({
            where: {
                // @ts-ignore
                email: session?.user?.email,
            }
        })
        const notifications = await prisma.notification.findMany({
            where: {
                read: false,
                userId: user?.id
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        const events = await prisma.event.findMany({
            where:{
                id:{
                    // @ts-ignore

                    in: notifications.map(notification => notification.eventId)
                }
            }
        })
        const artistIds = notifications
            .filter(notification => notification.artistId !== null)
            .map(notification => notification.artistId);

        const artists = await prisma.artist.findMany({
            where: {
                id: {
                    // @ts-ignore

                    in: artistIds
                }
            }
        });

        const organisationIds = notifications
            .filter(notification => notification.organisationId !== null)
            .map(notification => notification.organisationId);

        const organisations = await prisma.organisation.findMany({
            where: {
                id: {
                    // @ts-ignore

                    in: organisationIds
                }
            }
        });

        const notificationsWithDetails = notifications.map(notification => {
            const event = events.find(event => event.id === notification.eventId);
            let details = '';

            if (notification.artistId !== null) {
                const artist = artists.find(artist => artist.id === notification.artistId);
                details = `${artist?.artistName} participe à un événement`;
            } else if (notification.organisationId !== null) {
                const organisation = organisations.find(org => org.id === notification.organisationId);
                details = `${organisation?.organisationName} organise cet événement`;
            }

            return {
                ...notification,
                event,
                details
            };
        });

        const response = {
            notifications: notificationsWithDetails,
            events
        };

        return res.status(200).json(response);


    }catch (error){
        res.status(500).end();
    }
}