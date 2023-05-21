import type {NextApiRequest, NextApiResponse} from "next";
import prisma from "@/prisma/client";
import {getSession} from "next-auth/react";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import bodyParser from "body-parser";
import formidable from "formidable";
import path from "path";
import fs from "fs/promises";
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
        options.uploadDir = path.join(process.cwd(), "/public/images/artists");
        options.filename = (name, ext, path, form) => {
            const imageArtist: string =
                Date.now().toString() + "_" + path.originalFilename;
            return imageArtist;
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
    const {fields, files} = await readFile(req, true);
    const uploadedFile = files;
    const imagePath = uploadedFile.image.filepath;

    const imageName = uploadedFile.image.newFilename;
    const session = await getServerSession(req, res, authOptions)
    const userMail : string | null | undefined = session?.user?.email
    const artist = await prisma.artist.findFirst({
        where: {
            userId: session?.user?.id
        },
    })
    if (!userMail) {
        res.status(200).json(false);
        return;
    }
    if (req.method === "POST") {
        // Save image to disk and get its path

        try {
            await fs.readdir(path.join(process.cwd() + "/public", "/images/artists"));

            const user = await prisma.user.findFirst({
                where: {
                    email : userMail
                }
            })
            const artistName = fields.artistName;

            const imageDestination = path.join(
                process.cwd(),
                "/public/images/artists",
                imageName
            );
            await fs.rename(imagePath, imageDestination);
            const updateArtist : Artist | null = await prisma.artist.update({
                where: {
                    id: artist?.id
                },
                data: {
                    artistName:artistName,
                    image: imageName
                }
            });
            return res.status(200).json(updateArtist)
        } catch (error) {
            return res.status(500).json(error)
        }
    }
}