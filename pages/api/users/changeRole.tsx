import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/prisma/client';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
){
    const { userId } = req.body.params;
    const { role } = req.body.params;

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { role },
        });

        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors du changement de rôle de l'utilisateur." });
    }
}