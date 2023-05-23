import type {NextApiRequest, NextApiResponse} from "next";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import prisma from "@/prisma/client";
import formidable from "formidable";
import path from "path";
import fs from "fs/promises";
import { Prisma } from "@prisma/client";

import {useRouter} from "next/router";

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
            const imageEvent: string =
                Date.now().toString() + "_" + path.originalFilename;
            return imageEvent;
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
            // Sépare les noms d'artistes en utilisant la virgule
            const artistNames = fields.artist.split(',');

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
                        artistId: artistId,
                    });
                });
            }

            if (uploadedFile.image) {
                const imagePath = uploadedFile.image.filepath;
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
                if (new Date(dateTo) < new Date(dateFrom)) {
                    return res.status(403).json({message: "La date de fin doit être après la date de début"});
                }
                // Create event
                const prismaUser = await prisma.user.findUnique({
                    where: {email: session?.user?.email || undefined},
                });
                const eventData: Prisma.EventCreateInput = {
                    name: name,
                    description: description,
                    dateFrom: new Date(dateFrom),
                    dateTo: new Date(dateTo),
                    price: parseFloat(price),
                    address: { jsonAdress },
                    User: {
                        connect: { id: prismaUser.id },
                    },
                    unsignedArtists: unsignedArtists,
                    facebookLink: facebookLink,
                    image: imageName,
                    genres: {connect: {id: genre}},

                };

                const result = await prisma.event.create({
                    data: eventData,
                });

                if (artistsOnEventsData.length > 0) {
                    await prisma.artistsOnEvents.createMany({
                        data: artistsOnEventsData.map((artistData) => ({
                            ...artistData,
                            eventId: result.id,
                        })),
                    });
                }

                res.json({done: "ok"});
            }
        } catch (err) {
            //await fs.mkdir(path.join(process.cwd() + "/public", "/images/events"));
            console.error(err);
            res.status(500).json({message: "Il y a eu une erreur lors de la création de l'événement"});
        }
    }
}
