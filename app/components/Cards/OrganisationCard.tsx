import Link from "next/link";
interface OrganisationCard{
    organisation: {
        id: string,
        organisationName: string,
        image: string,
        description: string,
    }
}
export default function OrganisationCard(props: OrganisationCard) : JSX.Element{
    const {organisation} = props
    const organisationNameLower = organisation.organisationName.toLowerCase()
    const organisationName = organisationNameLower.replace(/\s+/g, "")
    return (
        <li key={organisation.id} className={" list-none mb-3"}>
            <Link href={`/organisations/${organisationName}`}>
                <div key={organisation.id} className={`h-full relative ${props.overflow ? 'w-[15rem] h-[15rem] flex md:w-auto ' : "flex flex-col items-center"}`}>
                    <div className={'w-96 h-96 relative'}>
                            <span
                                 className={"absolute top-0 left-0 right-0 px-4 py-2 bg-black bg-opacity-50 text-white w-max"}>
                                 <h2 className={"text-2xl"}>{organisation.organisationName}</h2>
                            </span>
                        <img src={`../images/organisations/${organisation.image}`} alt={`photo ${organisation.organisationName}`}
                             className={'w-full h-full object-cover'}/>
                    </div>
                </div>
            </Link>
        </li>)
}