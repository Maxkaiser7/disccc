"use client"
import React, {useEffect, useState} from "react";
import axios from "axios";
export default function newTest(){
    const [imageSrc, setImageSrc] = useState();
    const [uploadData, setUploadData] = useState();
    const [organisationName, setOrganisationName] = useState("");
    const [description, setDescription] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);

    const handleOnChange = (changeEvent: any) => {
        const file = changeEvent.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (onLoadEvent: any) => {
                setImageSrc(onLoadEvent?.target?.result);
                console.log(imageSrc)
                setUploadData(undefined);
            };
            reader.readAsDataURL(file);
        }
    };
    useEffect(() => {
        console.log(imageSrc); // Check the updated imageSrc value
    }, [imageSrc]);
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
        setIsDisabled(true);

    }
    return (
        <>
            <form className={"flex flex-col  items-center gap-2"} method={"post"} onSubmit={handleOnSubmit}>
                <label htmlFor="organisationName"  className={"text-white"}>Nom de l'organisation</label>
                <input type="text" name={"organisationName"} className={"bg-slate-600 text-white"}

                       onChange={(e) => setOrganisationName(e.target.value)}/>
                <label htmlFor="description"  className={"text-white"}>Description</label>
                <input type="text" name={"description"} className={"bg-slate-600 text-white"}

                       onChange={(e) => setDescription(e.target.value)}/>
                <p>
                    <input type="file" name={"file"} onChange={handleOnChange}/>
                </p>
                <button type={"submit"}
                        disabled={isDisabled}
                        className={"bg-gray-800 px-4 py-2 disabled:opacity-20"}>Confirmer</button>
            </form>
        </>
    )
}