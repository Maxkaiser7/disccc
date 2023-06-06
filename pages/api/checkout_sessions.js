const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { eventId, artistName, organisationName } = req.body; // Récupérez l'eventId depuis la requête
            // Create Checkout Sessions from body params.
            const session = await stripe.checkout.sessions.create({
                line_items: [
                    {
                        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                        price: 'price_1NE83WJ9Kq4mGJm2AM0LjePr',
                        quantity: 1,
                    },
                ],

                mode: 'payment',
                success_url: `${req.headers.origin}/payment/success/eventId=${encodeURIComponent(
                    eventId
                )}`,
                cancel_url: `${req.headers.origin}/?canceled=true`,
                automatic_tax: { enabled: true },
            });
            const today = new Date();
            const oneWeekLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); // Ajoute une semaine en millisecondes

            if (organisationName){
                const organisation = await prisma.organisation.findFirst({
                    where: {
                        organisationName: organisationName,
                    },
                })
                const updateOrganisation = await prisma.organisation.update({
                    where: {
                        id: organisation.id,
                    },
                    data: {
                        isPromoted: true,
                        endPromotion: oneWeekLater,
                    },
                })
            }

            if (artistName){
                const artist = await prisma.artist.findFirst({
                    where: {
                        artistName: artistName,
                    },
                })
                const updateArtist = await prisma.artist.update({
                    where: {
                        id: artist.id,
                    },
                    data: {
                        isPromoted: true,
                        endPromotion: oneWeekLater,
                    },
                })
            }
            if (eventId){
                const updateEvent = await prisma.event.update({
                    where: {
                        id: eventId,
                    },
                    data: {
                        isPromoted: true,
                        endPromotion: oneWeekLater,
                    },
                });
            }


            res.redirect(303, session.url);
        } catch (err) {
            res.status(err.statusCode || 500).json(err.message);
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}
