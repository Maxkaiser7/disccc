import type {NextApiRequest, NextApiResponse} from "next";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import prisma from "@/prisma/client";
import formidable from "formidable";
import path from "path";
import fs from "fs/promises";
export const dynamic = 'force-dynamic'
export const config = {
    api: {
        bodyParser: true,
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
        options.uploadDir = path.join(process.cwd(), "/public/images/organisations");
        options.filename = (name, ext, path, form) => {
            const imageOrganisation: string =
                Date.now().toString() + "_" + path.originalFilename;
            return imageOrganisation;
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
){
    const session = await getServerSession(req, res, authOptions);
    if (!session)
        return res.status(401).json({message: "Connectez vous pour pouvoir poster"});

    // Save image to disk and get its path
    const {fields, files} = await readFile(req, true);
    console.log({fields})
    const uploadedFile = files;
    //console.log(uploadedFile.image);
    let imagePath: string = ""
    let imageName: string = "";
    if ("filepath" in uploadedFile.image){
         imagePath = uploadedFile.image.filepath;
    }
    if ("newFilename" in uploadedFile.image){
        imageName = uploadedFile.image.newFilename;
    }
    const {organisationName} = fields;
    const {description} = fields;
    try {
        await fs.readdir(path.join(process.cwd() + "/public", "/images/organisations"));
    } catch (err) {
        await fs.mkdir(path.join(process.cwd() + "/public", "/images/organisations"));
    }
    const imageDestination = path.join(
        process.cwd(),
        "/public/images/organisations",
        imageName
    );
    await fs.rename(imagePath, imageDestination);

    // Create a new artistes record and associate it with the user
    const prismaUser = await prisma.user.findUnique({
        where: {email: session?.user?.email || undefined},
    });
    const newOrganisation = await prisma.organisation.create({
        data:{
            // @ts-ignore
            organisationName: organisationName,
            // @ts-ignore
            description: description,
            image: imageName,
            User: {connect: {id: prismaUser?.id}},

        }
    })
    res.status(200).json({done:"ok"});
}