import type {NextApiRequest, NextApiResponse} from "next";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import prisma from "@/prisma/client";
import formidable from "formidable";
import path from "path";
import fs from "fs/promises";
import {Prisma} from "@prisma/client";

export const dynamic = 'force-dynamic'
interface Notification {
    userId: string;
    artistId: string;
    organisationId: string;
    eventId: string;
    read: boolean;
}
// Fonction pour créer une notification
async function createNotification(userId :string, artistId : string, organisationId : string, eventId : string) {
    return prisma.notification.create({
        data: {
            userId,
            artistId,
            organisationId,
            eventId,
            read: false,
            createdAt: new Date(),
        },
    });
}
export const config = {
    api: {
        bodyParser: false,
    },
};

const readFile = (
    req: NextApiRequest,
    saveLocally?: boolean
): Promise<{
    fields: formidable.Fields;
    files: formidable.Files;
}> => {
    const options: formidable.Options = {};
    if (saveLocally) {
        options.uploadDir = path.join(process.cwd(), "/public/images/events");
        options.filename = (name, ext, path, form) => {
            return Date.now().toString() + "_" + path.originalFilename;

        };
    }

    const form = formidable(options);
    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            resolve({fields, files});
        });
    });
};
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        const session = await getServerSession(req, res, authOptions)
        if (!session) {
            return res.status(401).json({message: "Connectez vous pour pouvoir poster"});
        }

        try {
            //await fs.readdir(path.join(process.cwd() + "/public", "/images/events"));
            //const formData = req.body;
            // Save image to disk and get its path
            const {fields, files} = await readFile(req, true);
            const uploadedFile = files;
            //séparer les noms d'orgas en utilisant la virgule
            let organisationNames: string[] = [];

            if (typeof fields.organisation === 'string') {
                organisationNames = fields.organisation.split(',');
            } else if (Array.isArray(fields.organisation)) {
                organisationNames = fields.organisation;
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
            const artistNames = (Array.isArray(fields.artist) ? fields.artist[0] : fields.artist).split(',');
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
            const artistsOnEventsData: Prisma.ArtistsOnEventsCreateManyInput[] = [];
            if (existingArtistIds.length > 0) {
                existingArtistIds.forEach((artistId) => {
                    artistsOnEventsData.push({
                        eventId: "",
                        artistId: artistId
                    });
                });
            }
            let imagePath: string | undefined;
            let imageName: string | undefined;
            if (uploadedFile.image) {
                // @ts-ignore
                const imagePath = uploadedFile.image.filepath;
                // @ts-ignore
                const imageName = uploadedFile.image.newFilename;
                // handle the first file in the 'image' array here
                const imageDestination = path.join(
                    process.cwd(),
                    "/public/images/events",
                    imageName
                );
                await fs.rename(imagePath, imageDestination);

                const {name} = fields;
                const {description} = fields;
                const {dateTo} = fields;
                const {dateFrom} = fields;
                const {price} = fields;
                const {rue} = fields;
                const {commune} = fields;
                const {cp} = fields;
                const {facebookLink} = fields;
                const jsonAdress = {rue: rue, cp: cp, commune: commune};
                const {artist} = fields
                const {genre} = fields

                // Check if required fields are provided
                if (!name || !description || !dateFrom || !dateTo || !price || !jsonAdress) {
                    return res.status(403).json({message: "Veuillez remplir tous les champs"});
                }

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
                let formattedName: string | null | undefined;

                if (Array.isArray(name)) {
                    formattedName = name.join(', ');
                } else {
                    formattedName = name;
                }

                let formattedDescription: string | null | undefined;

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
                    image: imageName,
                    genres: formattedGenre !== undefined ? { connect: { id: formattedGenre } } : undefined,

                };

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
                const result = await prisma.event.create({
                    data: eventData,
                });

                const artistsOnEventsData: Prisma.ArtistsOnEventsCreateManyInput[] = [];

                if (existingArtists.length > 0) {
                    existingArtists.forEach((artist) => {
                        artistsOnEventsData.push({
                            eventId: result.id,
                            artistId: artist.id,
                        });
                    });
                }
                if (artistsOnEventsData.length > 0) {
                    await prisma.artistsOnEvents.createMany({
                        data: artistsOnEventsData.map((artistData) => ({
                            ...artistData,
                            eventId: result.id,
                        })),
                    });
                }
                //création d'une notification
                //trouver les users qui like
                // Récupérez les utilisateurs qui ont aimé un artiste ou une organisation
                const likedUsers = await prisma.likes.findMany({
                    where: {
                        OR: [
                            { artistId: existingArtistIds[0] },
                            { organisationId: existingOrganisationPrisma?.id },],
                    },
                    select: {
                        userId: true,
                    },
                });
                // Créez une notification pour chaque utilisateur
                for (const user of likedUsers) {
                    const { userId } = user;
                    // Vérifiez si artistId ou organisationId est défini
                    if (existingArtistIds || existingOrganisations) {
                        // Créez une notification pour l'utilisateur avec artistId ou organisationId
                        // @ts-ignore
                        await createNotification(userId, existingArtistIds[0], existingOrganisationPrisma?.id, result.id);
                    }
                }

                res.json({id: result.id});
            }
        } catch (err) {
            //await fs.mkdir(path.join(process.cwd() + "/public", "/images/events"));
            console.error(err);
            res.status(500).json({message: "Il y a eu une erreur lors de la création de l'événement"});
        }
    }
}
