import {NextApiRequest, NextApiResponse} from "next";
import prisma from "@/prisma/client";

export default async function handler(
    req:NextApiRequest,
    res:NextApiResponse
){
    try {
        const {userId} = req.body.params
        await prisma.user.delete({
            where: {
                id: userId
            }
        })
        res.status(200).json({ message: 'User deleted successfully.' });

    }catch (error){
        return res.status(500).json(error)
    }
}