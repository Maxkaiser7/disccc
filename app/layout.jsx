import './globals.css'
import Nav from "@/app/auth/Nav";


export default function RootLayout({children}) {
    return (
        <html lang="en">
        <head/>
        <body className={"mx-4"}>
            <Nav/>
            {children}
        </body>
        </html>
    )
}
