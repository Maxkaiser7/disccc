import type {NextApiRequest, NextApiResponse} from "next";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import prisma from "@/prisma/client";
import formidable from "formidable";
import path from "path";
import fs from "fs/promises";
import {useRouter} from "next/router";
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
}> => {
    const options: formidable.Options = {};

    const form = formidable(options);
    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            resolve({fields});
        });
    });
};
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        const session = await getServerSession(req, res, authOptions);
        if (!session) {
            return res
                .status(401)
                .json({ message: "Connectez vous pour pouvoir poster" });
        }

        const { fields } = await readFile(req, true);
        const { name } = fields;

        try {
            const prismaUser = await prisma.user.update({
                where: { email: session?.user?.email || undefined },
                data: {
                    // @ts-ignore
                    name: name,
                },
            });
            res.json({ done: "ok" });

        } catch (err) {
            console.error(err);
            res
                .status(500)
                .json({
                    message:
                        "Il y a eu une erreur lors de la mise à jour de vos données",
                });
        }
    }


}