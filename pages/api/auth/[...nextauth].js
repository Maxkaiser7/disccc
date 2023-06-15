import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import {PrismaAdapter} from "@next-auth/prisma-adapter";
import {PrismaClient} from "@prisma/client";
export const dynamic = 'force-dynamic'
const prisma = new PrismaClient();
export const authOptions = {
    adapter: PrismaAdapter(prisma),
    secret: "jdjfofeze5zf8f4sklas",
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
}
export default NextAuth(authOptions);