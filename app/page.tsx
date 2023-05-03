import Link from "next/link"
import FormPost from "@/app/Form";
import CreatePost from "../app/components/AddPost"
async function getPosts(){
    const res = await fetch(`${process.env.BASE_URL}/api/getPosts`)
    if(!res){
        console.log(res)
    }
    return res.json()
}
export default async function Home() {
    const data: {id: string, title: string}[] = await getPosts()
  return (
    <main>
        <CreatePost/>
    </main>
  )
}
