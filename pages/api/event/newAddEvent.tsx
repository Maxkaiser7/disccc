import {NextApiRequest, NextApiResponse} from "next";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import prisma from "@/prisma/client";
import {Prisma} from "@prisma/client";
import {event} from "next/dist/build/output/log";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const session = await getServerSession(req, res, authOptions);
        const data = req.body.params
        const user : any = await prisma.user.findFirst({
            where: {
                email: session?.user?.email
            }
        })
        let organisationNames: string[] = [];

        if (typeof data.organisation === 'string') {
            organisationNames = data.organisation.split(',');
        } else if (Array.isArray(data.organisation)) {
            organisationNames = data.organisation;
        }            //tableau pour stocker les orgas existants à connecter à l'évenement
        const existingOrganisations = [];
        //tableau pour stocker les noms d'orgas enregistrées
        const unsignedOrganisations = [];
        for (const organisationName of organisationNames) {
            // Recherche de l'organisation existante par nom
            const existingOrganisation = await prisma.organisation.findFirst({
                where: {
                    organisationName: organisationName.trim(), // Supprime les espaces vides autour du nom
                },
            });
            if (existingOrganisation) {
                // Si l'organisation existe, l'ajouter à la relation organisations de l'évenement
                existingOrganisations.push(existingOrganisation);
            } else {
                // Si l'organisation n'existe pas, ajouter le nom à la colonne unsignedOrganisations
                unsignedOrganisations.push(organisationName);
            }
        }
        //créer un tableau pour stocker les orgas existantes
        const existingOrganisationsArray = existingOrganisations.map(
            (organisation) => organisation.organisationName
        )
        //Créer un tableau d'OrganisationWhereUniqueInputs pour les orgas existantes
        const existingOrganisationWhereUniqueInputs = existingOrganisationsArray.map(
            (organisationName) => ({
                organisationName: organisationName,
            })
        )
        const existingOrganisationPrisma = await prisma.organisation.findFirst({
            where: {
                OR: existingOrganisationWhereUniqueInputs
            }
        })
        const organisationsOnEventsData: {organisationName: string}[] = [];
        if (existingOrganisationsArray.length > 0) {
            existingOrganisationsArray.forEach((organisationName) => {
                organisationsOnEventsData.push({
                    organisationName: organisationName,
                });
            });
        }
        if (unsignedOrganisations.length > 0) {
            unsignedOrganisations.forEach((organisationName) => {
                organisationsOnEventsData.push({
                    organisationName: organisationName,
                });
            });
        }
        // Sépare les noms d'artistes en utilisant la virgule
        const artistNames = (Array.isArray(data.artist) ? data.artist[0] : data.artist).split(',');
        // Tableau pour stocker les artistes existants à connecter à l'événement
        const existingArtists = [];

        // Tableau pour stocker les noms d'artistes non enregistrés
        const unsignedArtists = [];

        for (const artistName of artistNames) {
            // Recherche de l'artiste existant par nom
            const existingArtist = await prisma.artist.findFirst({
                where: {
                    artistName: artistName.trim(), // Supprime les espaces vides autour du nom
                },
            });

            if (existingArtist) {
                // Si l'artiste existe, l'ajouter à la relation artists de l'événement
                existingArtists.push(existingArtist);
            } else {
                // Si l'artiste n'existe pas, ajouter le nom à la colonne unsignedArtists
                unsignedArtists.push(artistName);
            }
        }
        // Créer un tableau d'artistIds pour les artistes existants
        const existingArtistIds = existingArtists.map((artist) => artist.id);

        // Créer un tableau d'artistWhereUniqueInputs pour les artistes existants
        const existingArtistWhereUniqueInputs = existingArtistIds.map((artistId) => ({
            id: artistId,
        }));

        const {name} = data;
        const {description} = data;
        const {dateTo} = data;
        const {dateFrom} = data;
        const {price} = data;
        const {rue} = data;
        const {commune} = data;
        const {cp} = data;
        const {facebookLink} = data;
        const jsonAdress = {rue: rue, cp: cp, commune: commune};
        const {artist} = data
        const {genre} = data
        const {imageSrc} = data
        // Check if required fields are provided

        // Check if dateTo is after dateFrom
        // @ts-ignore
        if (new Date(dateTo) < new Date(dateFrom)) {
            return res.status(403).json({message: "La date de fin doit être après la date de début"});
        }
        // Create event
        const prismaUser = await prisma.user.findUnique({
            where: {email: session?.user?.email || undefined},
        });
        const artistConnections = existingArtists.map((artist) => ({
            id: artist.id,
        }));
        //réglage pour typescript
        let formattedFacebookLink: string | null | undefined;
        if (Array.isArray(facebookLink)) {
            formattedFacebookLink = facebookLink.join(', ');
        } else {
            formattedFacebookLink = facebookLink;
        }
        let formattedName: string ;

        if (Array.isArray(name)) {
            formattedName = name.join(', ');
        } else {
            formattedName = name;
        }

        let formattedDescription: string ;

        if (Array.isArray(description)) {
            formattedDescription = description.join(', ');
        } else {
            formattedDescription = description;
        }
        let formattedDateFrom: Date | null = null;

        if (Array.isArray(dateFrom)) {
            const firstDate = dateFrom[0];
            formattedDateFrom = new Date(firstDate);
        } else {
            formattedDateFrom = new Date(dateFrom);
        }
        let formattedDateTo: Date | null = null;

        if (Array.isArray(dateTo)) {
            const firstDate = dateTo[0];
            formattedDateTo = new Date(firstDate);
        } else {
            formattedDateTo = new Date(dateTo);
        }
        let formattedPrice: number | null = null;

        if (typeof price === 'string') {
            formattedPrice = parseFloat(price);
        }
        let formattedGenre: string | undefined;

        if (Array.isArray(genre)) {
            formattedGenre = genre[0];
        } else {
            formattedGenre = genre;
        }
        const eventData: Prisma.EventCreateInput = {
            name: formattedName,
            description: formattedDescription,
            dateFrom: new Date(formattedDateFrom),
            dateTo: new Date(formattedDateTo),
            price: formattedPrice !== null ? formattedPrice : 0,
            address: {jsonAdress},
            User: {
                connect: {id: prismaUser?.id},
            },
            unsignedArtists: unsignedArtists,
            facebookLink: formattedFacebookLink,
            genres: formattedGenre !== undefined ? {connect: {id: formattedGenre}} : undefined,
            ...(data.imageSrc.startsWith("http") && { image: data.imageSrc }),

        };

        if (!data.imageSrc.startsWith("http")) {
            return res.status(403).json({message: "L'image doit être une URL valide"});
        }
        const result = await prisma.event.create({
            data: eventData,
        });
        const artistsOnEventsData: Prisma.ArtistsOnEventsCreateManyInput[] = [];
        if (existingArtistIds.length > 0) {
            existingArtistIds.forEach((artistId) => {
                artistsOnEventsData.push({
                    eventId: result.id,
                    artistId: artistId
                });

            });
        }
        // premier artist (a modifier)
        if (existingArtists.length > 0) {
            const artistWhereUniqueInput = {
                id: existingArtists[0].id,
            };

            eventData.artist = {
                connect: artistWhereUniqueInput,
            };
        }
        if (existingOrganisationPrisma) {
            eventData.organisation = {connect: {id: existingOrganisationPrisma.id}};
        }

        if (unsignedOrganisations) {
            eventData.unsignedOrganisation = unsignedOrganisations;
        }

        //const artistsOnEventsData: Prisma.ArtistsOnEventsCreateManyInput[] = [];

        if (existingArtists.length > 0) {
            existingArtists.forEach((artist) => {
                artistsOnEventsData.push({
                    eventId: result.id,
                    artistId: artist.id,
                });
            });
        }
        if (artistsOnEventsData.length > 0) {
            for (const artistData of artistsOnEventsData) {
                const existingRecord = await prisma.artistsOnEvents.findFirst({
                    where: {
                        artistId: artistData.artistId,
                        eventId: artistData.eventId,
                    },
                });
                if (!existingRecord) {
                    await prisma.artistsOnEvents.create({
                        data: {
                            eventId: artistData.eventId,
                            artistId: artistData.artistId,
                        },
                    });
                }
            }
        }

        //création d'une notification
        //trouver les users qui like
        // Récupérez les utilisateurs qui ont aimé un artiste ou une organisation
        const likedUsers = await prisma.likes.findMany({
            where: {
                OR: [
                    {artistId: existingArtistIds[0]},
                    {organisationId: existingOrganisationPrisma?.id},],
            },
            select: {
                userId: true,
            },
        });
        // Créez une notification pour chaque utilisateur
        for (const user of likedUsers) {
            const {userId} = user;
            // Vérifiez si artistId ou organisationId est défini
            if (existingArtistIds || existingOrganisations) {
                // Créez une notification pour l'utilisateur avec artistId ou organisationId
                // @ts-ignore
                await createNotification(userId, existingArtistIds[0], existingOrganisationPrisma?.id, result.id);
            }
        }

        res.json({id: result.id});
    }
    catch (error) {
        console.log(error)
        res.status(500).json({message: "Il y a eu une erreur lors de la création de l'événement"});

    }
}