"use client"
import { useEffect, useState } from "react";
import axios from "axios";
import OrganisationCard from "@/app/components/Cards/OrganisationCard";

export default function OrganisationsPagination() {
    const [organisations, setOrganisations] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        const fetchOrganisations = async () => {
            try {
                const response = await axios.get("/api/organisations/getOrganisations", {
                    params: {
                        page: currentPage,
                        limit: itemsPerPage,
                    },
                });
                setOrganisations(response.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchOrganisations();
    }, [currentPage, itemsPerPage]);

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    return (
        <div className="overflow-x-auto">
            <div className="md:flex md:flex-wrap md:justify-center md:gap-4">
                {organisations.length === 0 ? (
                    <p>Aucune organisation à afficher pour le moment.</p>
                ) : (
                    organisations.map((organisation) => (
                        <OrganisationCard
                            organisation={organisation}
                            key={organisation.id}
                            overflow={false}
                        />
                    ))
                )}
            </div>
            <div className={"flex justify-center gap-2"}>
                <button onClick={goToPreviousPage} disabled={currentPage === 1}>
                    Précédent
                </button>
                <span>{currentPage}</span>
                <button onClick={goToNextPage}>Suivant</button>
            </div>
        </div>
    );
}
