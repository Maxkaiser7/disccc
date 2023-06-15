import type {NextApiRequest, NextApiResponse} from "next";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import prisma from "@/prisma/client";
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
    const session = await getServerSession(req, res, authOptions);
    if (!session)
        return res.status(401).json({message: "Connectez vous pour pouvoir poster"});

    // Save image to disk and get its path
    const {fields, files} = await readFile(req, true);
    const uploadedFile = files;
    //console.log(uploadedFile.image);
    let imagePath: string = ""
    let imageName: string = "";
    if("filepath" in uploadedFile.image){
       imagePath = uploadedFile.image.filepath;
    }
    if("newFilename" in uploadedFile.image){
       imageName = uploadedFile.image.newFilename;
    }
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
    try {
        await fs.readdir(path.join(process.cwd() + "/public", "/images/artists"));
    } catch (err) {
        await fs.mkdir(path.join(process.cwd() + "/public", "/images/artists"));
    }


    const imageDestination = path.join(
        process.cwd(),
        "/public/images/artists",
        imageName
    );
    await fs.rename(imagePath, imageDestination);
    // Create a new artistes record and associate it with the user
    const prismaUser = await prisma.user.findUnique({
        where: {email: session?.user?.email || undefined},
    });
    const artistData = {
        artistName,
        image: imageName,
        description,
        genres: {
            connect: { id: genre }
        },
        User: { connect: { id: prismaUser?.id } },
        spotifyLink,
        instagramLink,
        soundcloudLink,
        twitterLink,
        appleLink,
        tiktokLink

    };

    // Check if the platform links exist and add them to artistData if they are not empty
    if (spotifyLink) {
        artistData.spotifyLink = spotifyLink;
    }
    if (instagramLink) {
        artistData.instagramLink = instagramLink;
    }
    if (soundcloudLink) {
        artistData.soundcloudLink = soundcloudLink;
    }
    if (twitterLink) {
        artistData.twitterLink = twitterLink;
    }
    if (appleLink) {
        artistData.appleLink = appleLink;
    }
    if (tiktokLink) {
        artistData.tiktokLink = tiktokLink;
    }
    // Create a new artistes record and associate it with the user
    const newArtist = await prisma.artist.create({
        // @ts-ignore
        data: artistData,
    });

    res.json({done: "ok"});
}
