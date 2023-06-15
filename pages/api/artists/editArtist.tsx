import type {NextApiRequest, NextApiResponse} from "next";
import prisma from "@/prisma/client";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import formidable from "formidable";
import path from "path";
import fs from "fs/promises";
export const dynamic = 'force-dynamic'
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
    const uploadedFile = files.image;
    let imagePath: string | null = "";
    let imageName: string | null = "";
    if ("filepath" in uploadedFile){
        imagePath = uploadedFile ? uploadedFile.filepath : null;
    }
    if ("newFilename" in uploadedFile){
        imageName = uploadedFile ? uploadedFile.newFilename : null;
    }

    const session = await getServerSession(req, res, authOptions)
    const user = await prisma.user.findFirst({
        where: {
            email: session?.user?.email
        }
    })
    const userMail: string | null | undefined = session?.user?.email
    const artist = await prisma.artist.findFirst({
        where: {
            userId: user?.id
        },
    })
    if (!userMail) {
        res.status(200).json(false);
        return;
    }
    if (req.method === "POST") {
        try {
            await fs.readdir(path.join(process.cwd() + "/public", "/images/artists"));

            const user = await prisma.user.findFirst({
                where: {
                    email: userMail
                }
            })
            //const artistName = fields.artistName;
            const {
                artistName,
                genre,
                description,
                spotifyLink,
                instagramLink,
                soundcloudLink,
                twitterLink,
                appleLink,
                tiktokLink
            } = fields;
            if (imagePath && imageName) {
                const imageDestination = path.join(
                    process.cwd(),
                    "/public/images/artists",
                    imageName
                );
                await fs.rename(imagePath, imageDestination);
            }
            const updateData: { [key: string]: any } = {};
            if (artistName) {
                updateData.artistName = artistName
            }
            // Check if the platform links exist and add them to updateData if they are not empty
            if (spotifyLink) {
                updateData.spotifyLink = spotifyLink;
            }
            if (instagramLink) {
                updateData.instagramLink = instagramLink;
            }
            if (soundcloudLink) {
                updateData.soundcloudLink = soundcloudLink;
            }
            if (twitterLink) {
                updateData.twitterLink = twitterLink;
            }
            if (appleLink) {
                updateData.appleLink = appleLink;
            }
            if (tiktokLink) {
                updateData.tiktokLink = tiktokLink;
            }
            if (imageName) {
                updateData.image = imageName
            }
            if(description){
                updateData.description = description
            }

            //await fs.rename(imagePath, imageDestination);
            const updateArtist: any = await prisma.artist.update({
                where: {
                    id: artist?.id
                },
                data: updateData,

            });
            return res.status(200).json(updateArtist)
        } catch (error) {
            return res.status(500).json(error)
        }
    }
}