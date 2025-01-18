import SignupCard from "@/components/auth/SignupCard"
import { notFound } from "next/navigation"

export default async function Signup({ searchParams }: { searchParams: { redirect: "participant" | "organisateur" } }) {

    const { redirect } = await searchParams

    if (!redirect) {
        <div>loading...</div>
    }


    if (redirect != "participant" && redirect != "organisateur") {
        notFound()
    }

    return (
        <SignupCard redirect={redirect} />
    )
}