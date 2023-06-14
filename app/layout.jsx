import './globals.css'
import Nav from "@/app/auth/Nav";
import QueryWrapper from "./auth/QueryWrapper";
import {SessionProvider} from "next-auth/react";
import {Azeret_Mono} from "next/font/google";
import Footer from "./components/Footer";
const azaret = Azeret_Mono({ subsets: ["latin"]})

export default function RootLayout({children}) {
    return (
        <html lang="en">
        <head>
        </head>
        <body className={`${azaret.className}`}>
        <QueryWrapper>
            <Nav/>
            {children}
        </QueryWrapper>
        <Footer/>
        </body>
        </html>
    )
}
