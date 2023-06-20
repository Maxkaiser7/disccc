import type {NextApiRequest, NextApiResponse} from "next";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import prisma from "@/prisma/client";
import formidable from "formidable";
import path from "path";
import fs from "fs/promises";
export const dynamic = 'force-dynamic'
/*export const config = {
    api: {
        bodyParser: false,
    },
};
*/


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions);
    if (!session)
        return res.status(401).json({message: "Connectez vous pour pouvoir poster"});
    // Save image to disk and get its path
    const fields = req.body.params;
    //const uploadedFile = files;
    //let imagePath: string = ""
    //let imageName: string = "";

    const {
        artistName,
        genre,
        description,
        spotifyLink,
        instagramLink,
        soundcloudLink,
        twitterLink,
        appleLink,
        tiktokLink,
        imageSrc,
        deezerLink
    } = fields;

    // Create a new artistes record and associate it with the user
    const prismaUser = await prisma.user.findUnique({
        where: {email: session?.user?.email || undefined},
    });
    const artistData = {
        artistName,
        ...(imageSrc.startsWith("http") && { image: imageSrc }),
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
        tiktokLink,
        deezerLink

    };
    console.log(artistData)

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
    if(deezerLink) {
        artistData.deezerLink = deezerLink;
    }
    // Create a new artistes record and associate it with the user
    const newArtist = await prisma.artist.create({
        // @ts-ignore
        data: artistData,
    });

    res.json({artistname: newArtist.artistName});
}
