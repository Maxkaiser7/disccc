"use client"
import React, {useState} from "react";
import axios from "axios";
export default function newTest(){
    const [imageSrc, setImageSrc] = useState();
    const [uploadData, setUploadData] = useState();
    const [organisationName, setOrganisationName] = useState("");
    const [description, setDescription] = useState("");
    const handleOnChange = (changeEvent: any)  => {
        const reader = new FileReader();
        reader.onload = (onLoadEvent : any) => {
            setImageSrc(onLoadEvent?.target?.result);
            setUploadData(undefined)
        }
        reader.readAsDataURL(changeEvent.target.files[0]);
    }
    const handleOnSubmit = async (e: any) => {
        e.preventDefault();
        const form = e.currentTarget
        const fileInput : any = Array.from(form.elements).find((element: any) => element.name === "file")
        const formData = new FormData();

        for (const file of fileInput.files){
            formData.append("file", file);
        }
        formData.append("upload_preset", "imgUpload")
        const data = await fetch("https://api.cloudinary.com/v1_1/dsn7y9mu4/image/upload", {
            method: "POST",
            body: formData,
        }).then(r => r.json());
        setImageSrc(data.url)
        setUploadData(data)

        const newFormData = new FormData()
        newFormData.append("organisationName", organisationName)
        newFormData.append("description", description)
        // @ts-ignore
        newFormData.append("image", imageSrc)
         await axios.post("/api/organisations/addOrganisation", {
            method: "POST",
            params: {organisationName, description, imageSrc},
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })
    }
    return (
     <>
         <form method={"post"} onChange={handleOnChange} onSubmit={handleOnSubmit}>
             <label htmlFor="organisationName"  className={"text-white"}>Nom de l'organisation</label>
             <input type="text" name={"organisationName"}
                    onChange={(e) => setOrganisationName(e.target.value)}/>
             <label htmlFor="description"  className={"text-white"}>Description</label>
             <input type="text" name={"description"}
                    onChange={(e) => setDescription(e.target.value)}/>
             <p>
                 <input type="file" name={"file"}/>
             </p>
             <button type={"submit"} className={"text-white"}>Submit</button>
         </form>
     </>
    )
}