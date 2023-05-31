import Link from "next/link"
import FormPost from "@/app/Form";
import CreatePost from "@/app/components/AddPost"
import GetArtists from "@/app/components/GetArtists";
import Hero from "@/app/components/Hero";
import {SessionProvider} from "next-auth/react";
import { Azeret_Mono } from "next/font/google"
import Featured from "@/app/components/Featured";
import EventsComing from "@/app/components/EventsComing";
export default async function Home() {

  return (
    <main>
        <Hero/>
        <Featured/>
        <GetArtists/>
        <EventsComing/>
    </main>
  )
}
