import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
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
            resolve({ fields, files });
        });
    });
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { fields, files } = await readFile(req, true);

    const uploadedFile = files.image;
    const imagePath = uploadedFile ? uploadedFile.filepath : null;
    const imageName = uploadedFile ? uploadedFile.newFilename : null;

    const session = await getServerSession(req, res, authOptions);
    const userMail: string | null | undefined = session?.user?.email;

    const userPrisma = await prisma.user.findFirst({
        where: {
            email: userMail,
        },
    })
    const organisation = await prisma.organisation.findFirst({
        where: {
            userId: userPrisma?.id,
        },
    });

    if (!userMail) {
        res.status(200).json(false);
        return;
    }

    if (req.method === "POST") {
        try {
            await fs.readdir(path.join(process.cwd() + "/public", "/images/organisations"));

            const user = await prisma.user.findFirst({
                where: {
                    email: userMail,
                },
            });
            const organisationName = fields.organisationName;

            if (imagePath && imageName) {
                const imageDestination = path.join(
                    process.cwd(),
                    "/public/images/organisations",
                    imageName
                );
                await fs.rename(imagePath, imageDestination);
            }
            const updateData: { [key: string]: any } = {};

            if (organisationName) {
                updateData.organisationName = organisationName;
            }

            if (imageName) {
                updateData.image = imageName;
            }

            const updateOrganisation: Organisation | null = await prisma.organisation.update({
                where: {
                    id: organisation?.id,
                },
                data: updateData,
            });

            return res.status(200).json(updateOrganisation);
        } catch (error) {
            return res.status(500).json(error);
        }
    }
}
