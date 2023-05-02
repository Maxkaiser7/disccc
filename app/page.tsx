import Link from "next/link"
import FormPost from "@/app/Form";
async function getPosts(){
    const res = await fetch(`${process.env.BASE_URL}/api/getPosts`)
    if(!res){
        console.log(res)
    }
    return res.json()
}
export default async function Home() {
    const data: {id: int; title: string}[] = await getPosts()
    console.log(data)
  return (
    <main>
        <h1>hey</h1>
    </main>
  )
}
