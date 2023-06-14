import Link from "next/link";

export default function layout({children}) {
    return (
        <div>
            <h1 className={"text-center"}>Admin page</h1>
            <ul className={"flex justify-center gap-4"}>
                <li>
                    <Link href={"/admin/posts"}>posts</Link>
                </li>
                <li>
                    <Link href={"/admin/artists"}>artistes</Link>
                </li>
                <li>
                    <Link href={"/admin/events"}>évènements</Link>
                </li>
                <li>
                    <Link href={"/admin/genres"}>genres</Link>
                </li>
                <li>
                    <Link href={"/admin/users"}>utilisateurs</Link>
                </li>
            </ul>
            {children}
        </div>
    )
}