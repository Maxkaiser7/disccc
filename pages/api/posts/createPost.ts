import type {NextApiRequest, NextApiResponse} from "next";
import prisma from "@/prisma/client";
type postProps = { title: string }

// @ts-ignore
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const post: postProps = JSON.parse(req.body);
        if (req.method === "POST") {
            //check for title
            if (!post.title.length) {
                return res.status(500).json({ message: "Vide" });
            }
            try {
                const data = await prisma.post.create({
                    data: { title: post.title },
                });
                res.status(200).json(data);
            } catch (error) {

                return res.status(500).json({ message: "error creating post", error: error });
            }
        }
    } catch (error) {
        return res.status(500).json({ message: "error parsing request body" });
    }
};