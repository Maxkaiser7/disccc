"use client"
import SubmitButton from "@/app/components/SubmitButton";
import {FormEvent} from "react";

export default function contactPage() {
    const handleSubmit = async (e: FormEvent<HTMLFormElement>)=>
    {
        e.preventDefault();
        const data: any = new FormData(e.currentTarget);
        try {
            const response = await fetch('/api/contact/send', {
                method: 'post',
                body: new URLSearchParams(data),
            });
            if (!response.ok) {
                throw new Error(`Invalid response: ${response.status}`);
            }
            alert('Merci pour votre message!');
        } catch (err) {
            console.error(err);
            alert("Réessayez plus tard");
        }
    }
    return (
        <main className={"p-8"}>
            <h1 className={"text-3xl text-center"}>Contact</h1>
            <div>
                <h2 className={"text-center"}>Nous contacter</h2>
                <form onSubmit={handleSubmit} className={"grid justify-center gap-4"}>
                    <div className="grid">
                        <label htmlFor="frm-email">Email</label>
                        <input
                            id="frm-email"
                            type="email"
                            name="email"
                            autoComplete="email"
                            required
                        />
                    </div>
                    <div className={"flex gap-4"}>
                        <div className="grid">
                            <label htmlFor="frm-first">Prénom</label>
                            <input
                                id="frm-first"
                                type="text"
                                name="first"
                                autoComplete="given-name"
                                required
                            />
                        </div>
                        <div className={"grid"}>
                            <label htmlFor="frm-last">Nom</label>
                            <input
                                id="frm-last"
                                type="text"
                                name="last"
                                autoComplete="family-name"
                                required
                            />
                        </div>
                    </div>
                    <div className="grid">
                        <label htmlFor="frm-message">Message</label>
                        <textarea id="frm-message" name="message"></textarea>
                    </div>
                    <div className="w-full">
                        <SubmitButton isDisabled={false} inputValue={"Envoyer"}/>
                    </div>
                </form>
            </div>
        </main>
    )
}