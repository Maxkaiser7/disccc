import Link from "next/link"
import FormPost from "@/app/Form";
import CreatePost from "@/app/components/AddPost"
import GetArtists from "@/app/components/GetArtists";
import Hero from "@/app/components/Hero";
import {SessionProvider} from "next-auth/react";
import { Azeret_Mono } from "next/font/google"
import Featured from "@/app/components/Featured";
import EventsComing from "@/app/components/EventsComing";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import GetLastOrganisations from "@/app/components/GetLastOrganisations";
import dynamic from "next/dynamic";
import {GetServerSideProps} from "next";
import prisma from "@/prisma/client";

const ComponentFeatured = dynamic(()=> import("@/app/components/Featured"))
const ComponentHero = dynamic(()=> import("@/app/components/Hero"))
// @ts-ignore
const ComponentGetArtists = dynamic(()=> import("@/app/components/GetArtists"))
const ComponentEventsComing = dynamic(()=> import("@/app/components/EventsComing"))
const ComponentGetLastOrganisations = dynamic(()=> import("@/app/components/GetLastOrganisations"))

export default async function Home() {
  return (
    <main>
        <ComponentHero/>
        <ComponentFeatured/>
        <ComponentGetArtists/>
        <ComponentEventsComing/>
        <ComponentGetLastOrganisations/>
    </main>
  )
}
