import Link from "next/link";

export default function Page() {

    return (
        <div>
            <h1>Payement accepté !</h1>
            <Link href={"/"}>Retour a l'accueil</Link>
            {/* Ajoutez le contenu supplémentaire de votre page de succès ici */}
        </div>
    );
}
