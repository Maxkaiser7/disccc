import {getSession} from "next-auth/react";
import prisma from "@/prisma/client";
import {getServerSession} from "next-auth";
import {NextApiRequest, NextApiResponse} from "next";
export default async function handler(req : NextApiRequest, res: NextApiResponse) {
    const session = await getSession({ req });
    const userMail : string | null | undefined = session?.user?.email

    if (!userMail) {
        res.status(200).json(false);
        return;
    }
    const user = await prisma.user.findUnique({
        where: {
            email : userMail
        }
    })



    const artist : any = await prisma.artist.findFirst({
        where: {
           userId: user?.id
        },
    });
    if(!artist){
        res.status(200).json(false);
    }else {
        res.status(200).json(true);

    }
}



