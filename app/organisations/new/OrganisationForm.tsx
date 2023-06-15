"use client"
import React,{useState} from "react";
import FormData from "form-data";
import axios from "axios";

export default function OrganisationForm(){
    const [selectedFile, setSelectedFile] = useState<File>();
    const [isDisabled, setIsDisabled] = useState(false);
    const [isRegistered, setIsRegistered] = useState();
    const [isConnected, setIsConnected] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [organisationName, setOrganisationName] = useState<string>("");
    const [description, setDescription] = useState("");

    const handleFileChange = (event : any) => {
        const files = event.target.files;
        setSelectedFile(files ? files : null);
    };
    const submitPost = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!selectedFile) return;

            const data = {
                image: selectedFile,
                organisationName: organisationName,
                description: description,
            };

            await axios.post("/api/signin/addOrganisation", data);

            setIsDisabled(true);
            // Traiter la réponse réussie si nécessaire
        } catch (err) {
            // Traiter l'erreur de la requête
        }

    return(
        <form className={"flex flex-col  items-center gap-2"}
              onSubmit={submitPost}>
            <label htmlFor="organisationName">Nom de l'organisation</label>
            <input type="text" name={"organisationName"}
                    onChange={(e) => setOrganisationName(e.target.value)}/>
            <label htmlFor="description">Description</label>
            <input type="text" name={"description"}
                    onChange={(e) => setDescription(e.target.value)}/>
            <label htmlFor="image">Image</label>
            <input
                type="file"
                name={"image"}
                onChange={({target}) => {
                    if (target.files) {
                        const file: File = target.files[0];
                        // @ts-ignore
                        setSelectedFile(URL.createObjectURL(file));
                        setSelectedFile(file);
                    }
                }}
            />
            <button
                type={"submit"}
                disabled={isDisabled}
                className={"bg-gray-800 px-4 py-2 disabled:opacity-20"}
            >
                Confirmer
            </button>
        </form>
    )
}