import EventForm from "@/app/events/new/EventForm";

export default function NewEvent(){
    return(
        <main>
            <h2 className={"mb-8 text-3xl"}>Créer un nouvel évenement</h2>
            <EventForm/>
        </main>
    )
}