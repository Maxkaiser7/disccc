import './globals.css'
import Nav from "@/app/auth/Nav";
import QueryWrapper from "./auth/QueryWrapper";

export default function RootLayout({children}) {
    return (
        <html lang="en">
        <head/>
        <body className={"mx-4"}>
        <QueryWrapper>
            <Nav/>
            {children}
        </QueryWrapper>
        </body>
        </html>
    )
}
