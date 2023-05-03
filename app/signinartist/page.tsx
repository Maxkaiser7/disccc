'use client'
import React, {useState, useEffect} from "react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import FormData from "form-data";

export default function SignInArtist(){
    const [artistName, setArtistName] = useState("");
    const [selectedFile, setSelectedFile] = useState<File>();




    const handleFileChange = (event) => {
        const files = event.target.files;
        setSelectedFile(files ? files : null);
    };

    const submitPost = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if(!selectedFile)return
            const formData = new FormData()
            formData.append("image", selectedFile)
            formData.append("artistName", artistName)
            const {data} = await axios.post("/api/signin/addArtist", formData)
            console.log(data)
        } catch (err){
            console.log(err.response?.data)
        }
    };
    return(
        <form onSubmit={submitPost} encType={"multipart/form-data"}>
            <input type="text" placeholder={"pseudo"} name={"artistName"}
                    onChange={(e) => setArtistName(e.target.value)}
                    value={artistName}/>
                <input type="file" name={"image"} onChange={({target}) => {
                    if (target.files){
                        const file :File = target.files[0]
                        setSelectedFile(URL.createObjectURL(file))
                        setSelectedFile(file)
                }} }/>
            <button type={"submit"}>
                Confirmer
            </button>
        </form>
    )
}