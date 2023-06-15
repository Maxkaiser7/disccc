import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/prisma/client';
export const dynamic = 'force-dynamic'
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        try {
            const { genreId } = req.body.params;

            // Supprimer le genre
            await prisma.genres.delete({
                where: {
                    id: genreId
                },
            });

            res.status(200).json({ message: 'Genre deleted successfully.' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Failed to delete the genre.' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed.' });
    }
}
