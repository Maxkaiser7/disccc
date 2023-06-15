"use client"
// @ts-ignore
import {shuffle} from "txt-shuffle"
import {useEffect} from "react";
import SearchBarNav from "@/app/components/SearchBarNav";
import Image from "next/image";
export default function Hero() {
    useEffect(()=> {
        const outputElement =
            document.getElementById("headings")
        if (outputElement){
            shuffle({
                text:"Découvrez, collaborez, jouez !",
                direction:'left',
                fps:25,
                onUpdate:(headings: any)=> {
                    outputElement.innerHTML = headings
                }
            })
        }
        const outputElement2 = document.getElementById("shuffle_p")
        if (outputElement2){
            shuffle({
                text:"Disccc vous permet de découvrir des artistes et des salles de concerts près de chez vous pour collaborer et vous produire sur scène.",
                direction:'left',
                fps:25,
                onUpdate:(shuffle_p: any)=> {
                    outputElement2.innerHTML = shuffle_p
                }
            })
        }
    })
    const imageClassname = "left-0 absolute -z-10 h-1/4 w-screen min-h-[25rem] top-[6rem] lg:h-[18rem] lg:min-h-[18rem]"
    const imageSrc = "/./images/assets/gradient.png"
    return (
        <div className="pb-52 flex flex-col items-center ">
            <div className="w-9/12 flex items-start justify-center flex-col m-8 ml-auto mr-auto absolute md:w-6/12">
                <span id={"headings"} className={"text-3xl flex flex-wrap"}></span>
                <p id={"shuffle_p"} className={"text-sm sm:max-h-2xl md:text-xl"}></p>
            </div>
            <Image alt={"logo"} src={imageSrc} className={imageClassname} width={500} height={500}/>
            <SearchBarNav/>
        </div>
    );

}