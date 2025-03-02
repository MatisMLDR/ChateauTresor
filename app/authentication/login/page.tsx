import { notFound } from "next/navigation"
import LoginCard from "@/components/auth/LoginCard"
export default async function Login({ searchParams }: { searchParams: { redirect: "participant" | "organisateur" } }) {

    const { redirect } = await searchParams

    if (!redirect) {
        <div>loading...</div>
    }


    if (redirect != "participant" && redirect != "organisateur" && redirect != "proprietaire") {
        notFound()
    }

    return (
        <LoginCard redirect={redirect} />
    )
}