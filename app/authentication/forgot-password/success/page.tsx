
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm'
import { notFound } from 'next/navigation'
export default async function ForgotPasswordSuccess({ params}: Readonly<{ params: { redirect: "participant" | "organisateur" } }>) {

    const redirect = await searchParams.redirect
if (!redirect) {
        <div>loading...</div>
    }

    if (redirect != "participant" && redirect != "organisateur") {
        notFound()
    }

    return (
        <div className="flex items-center justify-center bg-muted min-h-screen" >
            <Card className="w-[350px] mx-auto">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center py-4">
                        <Link href={redirect === "participant" ? "/" : "/organisateur"}>
                            <Image src="/logo.svg" alt="logo" width={50} height={50} />
                        </Link>
                    </div>

                    <CardTitle className="text-2xl font-bold">Your password reset request has been processed. Check your email for a password reset request</CardTitle>
                    <CardDescription>Go back to <Link href={`/login?redirect=${redirect}`}>Login</Link></CardDescription>
                </CardHeader>
            </Card>
        </div>
    )
}