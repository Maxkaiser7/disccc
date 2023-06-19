import './globals.css'
import Nav from "@/app/auth/Nav";
import QueryWrapper from "./auth/QueryWrapper";
import {SessionProvider} from "next-auth/react";
import {Azeret_Mono} from "next/font/google";
import Footer from "./components/Footer";
import {authOptions} from "../pages/api/auth/[...nextauth]";
import {getServerSession} from "next-auth";
const azaret = Azeret_Mono({ subsets: ["latin"]})

export default async function RootLayout({children}) {

    return (
        <html lang="en">
        <head>
        </head>
        <body className={`${azaret.className} bg-slate-700`}>
            <Nav/>
            {children}
        <Footer/>
        </body>
        </html>
    )
}
