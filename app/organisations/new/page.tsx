import OrganisationForm from "@/app/organisations/new/OrganisationForm";

export default function NewOrganisation(){
    return(
        <main>
            <h2 className={"text-center text-white bold text-4xl mb-8"}>S'inscrire comme organisation</h2>
            <OrganisationForm/>
        </main>
    )
}