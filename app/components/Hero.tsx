"use client"
import {shuffle} from "txt-shuffle"
import {useEffect} from "react";
import SearchBarNav from "@/app/components/SearchBarNav";
export default function Hero() {
    useEffect(()=> {
        const outputElement =
            document.getElementById("headings")
        shuffle({
            text:"Découvrez, partagez, jouez !",
            direction:'random',
            fps:25,
            onUpdate:(headings: any)=> {
                outputElement.innerHTML = headings
            }
        })
        const outputElement2 = document.getElementById("shuffle_p")
        shuffle({
            text:"Disccc vous permet de découvrir des artistes et des salles de concerts près de chez vous pour collaborer et vous produire sur scène.",
            direction:'left',
            fps:25,
            onUpdate:(shuffle_p: any)=> {
                outputElement2.innerHTML = shuffle_p
            }
        })
    })
    return (
        <div className="pb-52 ">
            <div className=" flex items-start justify-center flex-col m-8 ml-auto mr-auto relative w-6/12">
                <span id={"headings"} className={"text-3xl flex flex-wrap"}></span>
                <p id={"shuffle_p"} className={"text-sm md:text-xl"}></p>
            </div>
            <img
                src="../images/assets/gradient.png"
                alt="hero gradient"
                className="left-0 absolute -z-10 h-1/4 w-screen min-h-[25rem] top-[6rem]"
            />
            <SearchBarNav/>
        </div>
    );

}