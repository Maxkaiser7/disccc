import Link from "next/link";

export default function layout({children} : any) {
    return (
        <div>
            <h1 className={"text-center text-3xl"}>Admin page</h1>
            <ul className={"flex justify-center gap-4"}>
                <li className={"py-2 px-4 bg-slate-600"} key={"post"}>
                    <Link href={"/admin/posts"}>posts</Link>
                </li>
                <li className={"py-2 px-4 bg-slate-600"} key={"artist"}>
                    <Link href={"/admin/artists"}>artistes</Link>
                </li>
                <li className={"py-2 px-4 bg-slate-600"} key={"event"}>
                    <Link href={"/admin/events"}>évènements</Link>
                </li>
                <li className={"py-2 px-4 bg-slate-600"} key={"genre"}>
                    <Link href={"/admin/genres"}>genres</Link>
                </li>
                <li className={"py-2 px-4 bg-slate-600"} key={"users"}>
                    <Link href={"/admin/users"}>utilisateurs</Link>
                </li>
            </ul>
            {children}
        </div>
    )
}