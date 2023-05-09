import './globals.css'
import Nav from "@/app/auth/Nav";
import QueryWrapper from "./auth/QueryWrapper";
import {SessionProvider} from "next-auth/react";
import {Azeret_Mono} from "next/font/google";
const azaret = Azeret_Mono({ subsets: ["latin"]})

export default function RootLayout({children}) {
    return (
        <html lang="en">
        <head>
        </head>

        <body className={`mx-4 ${azaret.className}`}>
        <QueryWrapper>
            <Nav/>
            {children}
        </QueryWrapper>
        </body>
        </html>
    )
}
