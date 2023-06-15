import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import prisma from "@/prisma/client";
import path from "path";
import fs from "fs/promises";

export const dynamic = 'force-dynamic';
export const config = {
    api: {
        bodyParser: true,
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { organisationName, description, selectedFile } = req.body;

    const session = await getServerSession(req, res, authOptions);
    if (!session)
        return res.status(401).json({ message: "Connectez-vous pour pouvoir poster" });

    try {
        // Save image to disk and get its path
        const uploadDir = path.join(process.cwd(), "/public/images/organisations");
        await fs.mkdir(uploadDir, { recursive: true });

        const timestamp = Date.now().toString();
        const imageFileName = `${timestamp}_${selectedFile.name}`;
        const imageDestination = path.join(uploadDir, imageFileName);

        await fs.rename(selectedFile.path, imageDestination);

        // Create a new organisation record and associate it with the user
        const prismaUser = await prisma.user.findUnique({
            where: { email: session?.user?.email || undefined },
        });

        const newOrganisation = await prisma.organisation.create({
            data: {
                organisationName,
                description,
                image: imageFileName,
                User: { connect: { id: prismaUser?.id } },
            },
        });

        res.status(200).json({ done: "ok" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la création de l'organisation" });
    }
}
