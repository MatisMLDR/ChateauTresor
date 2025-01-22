import ForgotPasswordCard from "@/components/auth/ForgotPasswordCard"
import { notFound } from "next/navigation"

export default async function ForgotPassword({ searchParams }: { searchParams: { redirect: "participant" | "organisateur" } }) {

    const { redirect } = await searchParams
if (!redirect) {
        <div>loading...</div>
    }


    if (redirect != "participant" && redirect != "organisateur" && redirect != "proprietaire") {
        notFound()
    }

    return (
        <ForgotPasswordCard redirect={redirect} />
    )
}